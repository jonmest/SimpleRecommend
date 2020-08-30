package controllers

import (
	"encoding/json"

	"raas.com/api/v1/db"
	"raas.com/api/v1/models"

	"github.com/gofiber/fiber"
)

func jsonEscape(i string) string {
	b, err := json.Marshal(i)
	if err != nil {
		panic(err)
	}
	s := string(b)
	return s[1 : len(s)-1]
}

func GetRecommendations(c *fiber.Ctx) {
	provider_username := c.Query("provider")
	actor := c.Query("actor")

	if provider_username == "" || actor == "" {
		c.Status(500).JSON(fiber.Map{"error": "Must supply provider and actor query parameters."})
		return
	}

	var provider models.Provider
	db.DB.Where("username = ?", provider_username).First(&provider)

	var authorized bool = IsAuthorizedOrigin(c, provider)
	if !authorized {
		c.Status(401).JSON(fiber.Map{
			"message": "You sent a request from a non-whitelisted origin.",
		})
		return
	}

	var recommendation models.Recommendation
	db.DB.Raw("SELECT * FROM recommendations WHERE actor = ? AND provider = ? ORDER BY created DESC LIMIT 1", actor, provider_username).Scan(&recommendation)
	// db.DB.Order("created").Where("actor = ? AND provider = ?", actor, provider).Find(&recommendation)
	// last := len(recommendation) - 1
	var items []string
	json.Unmarshal([]byte(recommendation.Items), &items)
	c.Status(200).JSON(fiber.Map{"items": items})
}
