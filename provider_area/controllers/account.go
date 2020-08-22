package controllers

import (
	"os"
	"provider-area/config"
	"provider-area/db"
	"provider-area/models"
	"provider-area/models/forms"
	util "provider-area/utils"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber"
	"github.com/stripe/stripe-go/v71"
	"github.com/stripe/stripe-go/v71/customer"
)

const MIN_PWD_LEN int = 7

func GetUser(c *fiber.Ctx) {
	id := c.Params("id")
	token := c.Locals("user").(*jwt.Token)
	db := db.DB

	if !util.ValidToken(token, id) {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid token id", "data": nil})
		return
	}

	var user models.Provider
	db.Find(&user, id)
	if user.Username == "" {
		c.Status(404).JSON(fiber.Map{"status": "error", "message": "No user found with ID", "data": nil})
		return
	}

	c.JSON(fiber.Map{"status": "success", "message": "User found", "data": user})
}

func CreateAccountAndCustomer(c *fiber.Ctx) {
	// To return in response
	type NewAccount struct {
		Username string           `json:"username"`
		Email    string           `json:"email"`
		Token    string           `json:"token"`
		Customer *stripe.Customer `json:"stripe_customer"`
	}
	db := db.DB
	input := *new(forms.Provider)
	if err := c.BodyParser(&input); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid JSON input."})
		return
	}

	// Validation
	if input.Email == "" || input.Username == "" {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Username and email required."})
		return
	}
	if len(input.Password) < MIN_PWD_LEN {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Password too short. Minimum is 7 characters."})
		return
	}

	hash, err := util.HashPassword(input.Password)
	if err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Something went wrong."})
		return
	}

	/**
	* Create a Stripe customer
	 */
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
	params := &stripe.CustomerParams{
		Email: stripe.String(input.Email),
	}

	cus, err := customer.New(params)
	if err != nil {
		c.SendStatus(fiber.StatusInternalServerError)
		return
	}

	// Instantiate Provider struct and save in DB
	account := models.Provider{
		Username:         input.Username,
		Active:           false,
		Email:            input.Email,
		PasswordHash:     hash,
		StripeCustomerId: cus.ID,
	}
	if err := db.Create(&account).Error; err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create user", "data": err})
		return
	}

	/**
	* Create a JWT token for new user so they don't have to login next
	* 72-hour session
	 */
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["username"] = account.Username
	claims["user_id"] = account.ID
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	t, err := token.SignedString([]byte(config.Config("SECRET")))
	if err != nil {
		c.SendStatus(fiber.StatusInternalServerError)
		return
	}

	// Return just email, username, stripe customer and new JWT token in response
	newAccount := NewAccount{
		Email:    input.Email,
		Username: input.Username,
		Token:    t,
		Customer: cus,
	}

	c.JSON(fiber.Map{"status": "success", "message": "Created user", "data": newAccount})
}

func UpdateUser(c *fiber.Ctx) {
	type UpdateUserInput struct {
		TypeOfUserData string `json:"type_of_user_data"`
	}
	var input UpdateUserInput
	if err := c.BodyParser(&input); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})
		return
	}

	id := c.Params("id")
	token := c.Locals("user").(*jwt.Token)
	if !util.ValidToken(token, id) {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid token id", "data": nil})
		return
	}

	db := db.DB
	var user models.Provider
	db.First(&user, id)
	if input.TypeOfUserData != "" {
		user.TypeOfUserData = input.TypeOfUserData
	}
	db.Save(&user)

	c.JSON(fiber.Map{"status": "success", "message": "User successfully updated", "data": user})
}

func DeleteAccount(c *fiber.Ctx) {
	type PasswordInput struct {
		Password string `json:"password"`
	}
	var input PasswordInput
	if err := c.BodyParser(&input); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})
		return
	}

	id := c.Params("id")
	token := c.Locals("user").(*jwt.Token)
	if !util.ValidToken(token, id) {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid token id", "data": nil})
		return
	}
	if !util.ValidUser(id, input.Password) {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Not valid user", "data": nil})
		return
	}

	db := db.DB
	var user models.Provider
	db.First(&user, id)
	db.Delete(&user)

	c.JSON(fiber.Map{"status": "success", "message": "User successfully deleted", "data": nil})
}
