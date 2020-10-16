package controllers

import (
	"encoding/json"

	"raas.com/api/v1/db"
	"raas.com/api/v1/models"

	"github.com/gofiber/fiber"
)

func GetRecommendations(c *fiber.Ctx) {
	providerUsername := c.Query("provider")
	actor := c.Query("actor")

	if providerUsername == "" || actor == "" {
		c.Status(500).JSON(fiber.Map{"error": "Must supply provider and actor query parameters."})
		return
	}

	var provider models.Provider
	db.DB.Where("username = ?", providerUsername).First(&provider)

	var recommendation models.Recommendation
	db.DB.Raw("SELECT * FROM recommendations WHERE actor = ? AND provider = ? ORDER BY created DESC LIMIT 1", actor, providerUsername).Scan(&recommendation)

	var items []string
	json.Unmarshal([]byte(recommendation.Items), &items)
	c.Status(200).JSON(fiber.Map{"items": items})
}
