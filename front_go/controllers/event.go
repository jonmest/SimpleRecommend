package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"raas.com/api/v1/utils"
	"time"

	"github.com/gofiber/fiber"
	"raas.com/api/v1/db"
	"raas.com/api/v1/models"
)

var ctx = context.Background()

type EventInput struct {
	Type     string  `json:"type" binding:"required"`
	Actor    *string  `json:"actor" binding:"required"`
	Item     *string  `json:"item" binding:"required"`
	Data     *float64 `json:"data" binding:"required"`
}

// POST /event
func SaveEvent(c *fiber.Ctx) {
	input := new(EventInput)
	payload := c.Locals("providerPayload").(utils.Payload)
	fmt.Println(payload.Username)
	if err := c.BodyParser(input); err != nil {
		c.Status(500).JSON(fiber.Map{
			"message": "Failed to parse JSON input. Review the schema.",
		})
		return
	}

	if input.Actor == nil {
		c.Status(400).JSON(fiber.Map{
			"message": "Please provide an Actor ID in request body.",
		})
	}
	if input.Item == nil {
		c.Status(400).JSON(fiber.Map{
			"message": "Please provide an Item ID in request body.",
		})
	}
	if input.Data == nil {
		c.Status(400).JSON(fiber.Map{
			"message": "Please provide Event attribute \"data\" in request body.",
		})
	}

	event := models.Event{
		Type:     input.Type,
		Actor:    *input.Actor,
		Item:     *input.Item,
		Data:     *input.Data,
		Provider: payload.Username,
		}
	fmt.Println(event)
	db.DB.Create(&event)

	key := fmt.Sprintf("is_active:%v_%v", payload.Username, event.Actor)

	isRecentlyActive, err := db.RDB.Get(ctx, key).Result()
	if err != nil || isRecentlyActive == "true" {
		db.RDB.Set(ctx, key, "true", 5*time.Minute)
		// Add new computation task to queue
		task := &models.Task{Actor: event.Actor, Provider: payload.Username}
		jsonTask, _ := json.Marshal(task)
		db.RDB.RPush(ctx, "queue:compute", string(jsonTask))
		fmt.Println("Stored in Redis queue.")
	}

	c.Status(200).JSON(fiber.Map{"data": "success"})
}
