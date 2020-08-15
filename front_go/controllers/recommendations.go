package controllers

import (
	"encoding/json"
	"fmt"
	"time"

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

func Recommendations(c *fiber.Ctx) {
	provider := c.Query("provider")
	actor := c.Query("actor")
	var items []string
	var rawString string
	fmt.Println(provider)
	if provider == "" || actor == "" {
		c.Status(500).JSON(fiber.Map{"error": "Must supply provider and actor query parameters."})
		return
	}

	// Check if cached in redis first
	key := fmt.Sprintf("recs_%v_%v", provider, actor)
	rawString, err := models.RDB.Get(ctx, key).Result()
	if err != nil {

		models.DB.Raw("SELECT items FROM recommendations WHERE actor = ($1) AND provider = ($2);",
			actor, provider).Row().Scan(&rawString)

		err := models.RDB.Set(ctx, fmt.Sprintf("%v_%v", provider, actor), rawString, 30*time.Minute).Err()
		if err != nil {
			panic(err)
		}
	}

	if rawString == "" {
		c.Status(500).JSON(fiber.Map{"error": "No recommendations could be found."})
		return
	}

	json.Unmarshal([]byte(rawString), &items)
	c.Status(200).JSON(fiber.Map{"key": items})
}
