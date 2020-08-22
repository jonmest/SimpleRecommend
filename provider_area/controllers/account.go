package controllers

import (
	"provider-area/db"
	"provider-area/models"
	"provider-area/models/forms"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber"
)

func GetUser(c *fiber.Ctx) {
	id := c.Params("id")
	token := c.Locals("user").(*jwt.Token)

	if !validToken(token, id) {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid token id", "data": nil})
		return
	}

	db := db.DB
	var user models.Provider
	db.Find(&user, id)
	if user.Username == "" {
		c.Status(404).JSON(fiber.Map{"status": "error", "message": "No user found with ID", "data": nil})
		return
	}
	user.PasswordHash = ""
	c.JSON(fiber.Map{"status": "success", "message": "User found", "data": user})
}

func CreateAccountAndCustomer(c *fiber.Ctx) {
	type NewAccount struct {
		Username string `json:"username"`
		Email    string `json:"email"`
	}

	db := db.DB
	input := *new(forms.Provider)
	if err := c.BodyParser(&input); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid JSON input."})
		return
	}
	if input.Email == "" || input.Username == "" {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Username and email required."})
		return
	}
	if len(input.Password) < MIN_PWD_LEN {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Password too short. Minimum is 7 characters."})
		return
	}

	hash, err := hashPassword(input.Password)
	if err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Something went wrong."})
		return
	}

	account := models.Provider{
		Username:     input.Username,
		Plan:         "basic",
		Active:       true,
		Email:        input.Email,
		PasswordHash: hash}

	if err := db.Create(&account).Error; err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create user", "data": err})
		return
	}

	newAccount := NewAccount{
		Email:    input.Email,
		Username: input.Username}

	c.JSON(fiber.Map{"status": "success", "message": "Created user", "data": newAccount})
}

// UpdateUser update user
func UpdateUser(c *fiber.Ctx) {
	type UpdateUserInput struct {
		TypeOfUserData string `json:"type_of_user_data"`
		Plan           string `json:"plan"`
	}
	var uui UpdateUserInput
	if err := c.BodyParser(&uui); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})
		return
	}
	id := c.Params("id")
	token := c.Locals("user").(*jwt.Token)

	if !validToken(token, id) {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid token id", "data": nil})
		return
	}

	db := db.DB
	var user models.Provider

	db.First(&user, id)

	if uui.Plan != "" {
		user.Plan = uui.Plan
	}
	if uui.TypeOfUserData != "" {
		user.TypeOfUserData = uui.TypeOfUserData
	}

	db.Save(&user)

	c.JSON(fiber.Map{"status": "success", "message": "User successfully updated", "data": user})
}

// DeleteUser delete user
func DeleteAccount(c *fiber.Ctx) {
	type PasswordInput struct {
		Password string `json:"password"`
	}
	var pi PasswordInput
	if err := c.BodyParser(&pi); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})
		return
	}
	id := c.Params("id")
	token := c.Locals("user").(*jwt.Token)

	if !validToken(token, id) {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid token id", "data": nil})
		return
	}

	if !validUser(id, pi.Password) {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Not valid user", "data": nil})
		return
	}

	db := db.DB
	var user models.Provider

	db.First(&user, id)

	db.Delete(&user)
	c.JSON(fiber.Map{"status": "success", "message": "User successfully deleted", "data": nil})
}
