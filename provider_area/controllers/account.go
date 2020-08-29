package controllers

import (
	"fmt"
	"os"
	"provider-area/config"
	"provider-area/db"
	"provider-area/models"
	"provider-area/models/forms"
	util "provider-area/utils"
	"time"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber"
	"github.com/jinzhu/gorm"
)

const MIN_PWD_LEN int = 7

func GetUser(c *fiber.Ctx) {
	id := util.GetUserIdFromToken(c)
	db := db.DB

	var user models.Provider
	db.Find(&user, id)
	if user.Username == "" {
		c.Status(404).JSON(fiber.Map{"status": "error", "message": "No user found with ID", "data": nil})
		return
	}

	c.JSON(fiber.Map{"status": "success", "message": "User found", "data": user})
}

func CreateAccount(c *fiber.Ctx) {
	// To return in response
	type NewAccount struct {
		ID       uint   `json:"id"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Token    string `json:"token"`
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

	not_taken_email := db.Where("email = ?", input.Email).First(&models.Provider{}).RecordNotFound()
	if !not_taken_email {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create user", "data": "Email is taken. Try logging in or using a different email."})
		return
	}

	not_taken_username := db.Where("username = ?", input.Username).First(&models.Provider{}).RecordNotFound()
	if !not_taken_username {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create user", "data": "Username is taken. Try logging in or using a different username."})
		return
	}

	// Instantiate Provider struct and save in DB
	account := models.Provider{
		Username:     input.Username,
		Active:       false,
		Email:        input.Email,
		PasswordHash: hash,
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

	var u models.Provider
	if err := db.Where(&models.Provider{Username: account.Username}).Find(&u).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			c.Status(500)
			return
		}
		c.Status(500)
		return
	}

	// Return just email, username, stripe customer and new JWT token in response
	newAccount := NewAccount{
		Email:    input.Email,
		Username: input.Username,
		Token:    t,
		ID:       u.ID,
	}

	c.JSON(fiber.Map{"status": "success", "message": "Created user", "data": newAccount})
}

func UpdateUser(c *fiber.Ctx) {
	type UpdateUserInput struct {
		MaxRating float64 `json:"max_rating"`
		MinRating float64 `json:"min_rating"`
		Domain    string  `json:"domain"`
	}
	var input UpdateUserInput
	if err := c.BodyParser(&input); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})
		return
	}

	id := util.GetUserIdFromToken(c)

	db := db.DB
	var user models.Provider
	db.First(&user, id)
	user.MaxRating = input.MaxRating
	user.MinRating = input.MinRating
	user.Domain = input.Domain
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

	id := util.GetUserIdFromToken(c)

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

func RequestVerifyEmail(c *fiber.Ctx) {
	id := util.GetUserIdFromToken(c)
	db := db.DB
	var user models.Provider
	db.First(&user, id)

	// email := user.Email

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": user.Username,
		"user_id":  user.ID,
		"email":    user.Email,
		"expires":  time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenString, err := token.SignedString([]byte(os.Getenv("jwt_secret")))

	if err != nil {
		c.SendStatus(500)
		return
	}
	// claims := token.Claims.(jwt.MapClaims)
	// claims["username"] = user.Username
	// claims["email"] = user.Email
	// claims["user_id"] = user.ID
	// claims["exp"] = time.Now().Add(time.Hour * 48).Unix()
	// t, err := token.SignedString([]byte(config.Config("jwt_secret")))

	from := mail.NewEmail("Example User", "contrarianandfree@gmail.com")
	subject := "Sending with Twilio SendGrid is Fun"
	to := mail.NewEmail("Example User", "jonmester3@gmail.com")
	plainTextContent := "and easy to do anywhere, even with Go"
	htmlContent := "<strong>and easy to do anywhere, even with Go</strong>. <a href='localhost:3001/verify-email-token/'" + tokenString + ">Click here to verify.</a>"
	message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
	response, err := client.Send(message)
	fmt.Println(tokenString)
	if err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Not valid user", "data": err})
		return
	}
	fmt.Println(response.Body)
	c.SendStatus(200)
	return
}

func VerifyEmailWithToken(c *fiber.Ctx) {
	type TokenInput struct {
		Token string `json:"token"`
	}
	var input TokenInput
	if err := c.BodyParser(&input); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})
		return
	}

	token, err := jwt.Parse(input.Token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("jwt_secret")), nil
	})
	claims, _ := token.Claims.(jwt.MapClaims)

	if err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid token.", "data": err})
		return
	}

	email := claims["email"].(string)
	id := claims["user_id"].(float64)

	var user models.Provider
	db.DB.Model(&user).Where("email = ? AND id = ?", email, id).Update("verified_email", true)
	c.SendStatus(200)
}
