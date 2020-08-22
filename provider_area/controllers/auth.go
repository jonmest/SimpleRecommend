package controllers

import (
	"provider-area/config"
	"provider-area/models"
	util "provider-area/utils"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber"
)

func Login(c *fiber.Ctx) {
	// Input
	type LoginInput struct {
		Identity string `json:"identity"`
		Password string `json:"password"`
	}
	var input LoginInput
	// Output
	type UserData struct {
		ID       uint   `json:"id"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	var ud UserData

	// Parse request body into LoginInput
	if err := c.BodyParser(&input); err != nil {
		c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Error on login request", "data": err})
		return
	}
	identity := input.Identity
	pass := input.Password

	/**
	* Users input an identity, which can be both email and username.
	* First check if user can be found by email, if not, then username.
	 */
	email, err := util.GetUserByEmail(identity)
	if err != nil {
		c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Error on email", "data": err})
		return
	}

	var user *models.Provider
	if email == nil {
		user, err := util.GetUserByUsername(identity)
		if err != nil {
			c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Error on username", "data": err})
			return
		}
	}

	// Not found
	if email == nil && user == nil {
		c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "User not found", "data": err})
		return
	}

	if email == nil {
		ud = UserData{
			ID:       user.ID,
			Username: user.Username,
			Email:    user.Email,
			Password: user.PasswordHash,
		}
	} else {
		ud = UserData{
			ID:       email.ID,
			Username: email.Username,
			Email:    email.Email,
			Password: email.PasswordHash,
		}
	}
	/**
	* If request body's password does not have
	* the same hash as user's stored hash,
	* return unauthorized response
	 */
	if !util.CheckPasswordHash(pass, ud.Password) {
		c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Invalid password", "data": nil})
		return
	}

	/**
	* Create new JWT token for a 72-hour session
	 */
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["username"] = ud.Username
	claims["user_id"] = ud.ID
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	t, err := token.SignedString([]byte(config.Config("SECRET")))
	if err != nil {
		c.SendStatus(fiber.StatusInternalServerError)
		return
	}

	// Return JWT token
	c.JSON(fiber.Map{"status": "success", "message": "Success login", "token": t, "user_id": ud.ID})
}
