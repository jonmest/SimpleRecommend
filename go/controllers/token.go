package controllers

import (
	"crypto/rand"
	"encoding/base64"

	"github.com/gofiber/fiber"
	"raas.com/api/v1/models"
)

func generateRandomBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	// Note that err == nil only if we read len(b) bytes.
	if err != nil {
		return nil, err
	}

	return b, nil
}

// GenerateRandomString returns a URL-safe, base64 encoded
// securely generated random string.
func generateRandomString(s int) (string, error) {
	b, err := generateRandomBytes(s)
	return base64.URLEncoding.EncodeToString(b), err
}

func Token(c *fiber.Ctx) {
	input := new(models.TokenRequest)
	if err := c.BodyParser(input); err != nil {
		c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
		return
	}

	token, err := generateRandomString(32)
	if err != nil {
		c.Status(500).JSON(fiber.Map{"error": "Failed to create token."})
		return
	}

	models.DB.Exec("INSERT INTO actors (token, provider) VALUES ($1, $2);", token, input.Provider)
	c.Status(200).JSON(fiber.Map{"token": token})
}
