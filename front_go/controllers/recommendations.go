package controllers

import (
	"encoding/json"
	"fmt"
	"time"

	"raas.com/api/v1/models"

	"raas.com/api/v1/db"

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
	var items []string
	var rawString string

	if provider == "" || actor == "" {
		c.Status(500).JSON(fiber.Map{"error": "Must supply provider and actor query parameters."})
		return
	}

	// Check if cached in redis first
	key := fmt.Sprintf("recs:%v_%v", provider, actor)
	redisString, err := db.RDB.Get(ctx, key).Result()

	if err != nil {
		var recommendation models.Recommendation
		db.DB.Table("recommendations").Where("actor = ? AND provider = ?", actor, provider).First(&recommendation)
		// db.DB.Raw("SELECT items FROM recommendations WHERE actor = ($1) AND provider = ($2);",
		// 	actor, provider).Row().Scan(&rawString)

		// Cache in redis
		err := db.RDB.Set(ctx, fmt.Sprintf("recs:%v_%v", provider, actor), rawString, 20*time.Minute).Err()
		if err != nil {
			// Log something
		}

		if len(recommendation.Items) == 0 {
			c.Status(500).JSON(fiber.Map{"error": "No recommendations could be found."})
			return
		}

		json.Unmarshal([]byte(rawString), &recommendation.Items)
		c.Status(200).JSON(fiber.Map{"items": items})
		return
	}

	if redisString == "" {
		c.Status(500).JSON(fiber.Map{"error": "No recommendations could be found."})
		return
	}

	json.Unmarshal([]byte(redisString), &items)
	c.Status(200).JSON(fiber.Map{"items": items})
}
