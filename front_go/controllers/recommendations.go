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
	provider := c.Query("provider")
	actor := c.Query("actor")

	if provider == "" || actor == "" {
		c.Status(500).JSON(fiber.Map{"error": "Must supply provider and actor query parameters."})
		return
	}
	var recommendation models.Recommendation
	db.DB.Raw("SELECT * FROM recommendations WHERE actor = ? AND provider = ? ORDER BY created DESC LIMIT 1", actor, provider).Scan(&recommendation)
	// db.DB.Order("created").Where("actor = ? AND provider = ?", actor, provider).Find(&recommendation)
	// last := len(recommendation) - 1
	var items []string
	json.Unmarshal([]byte(recommendation.Items), &items)
	c.Status(200).JSON(fiber.Map{"items": items})
}
