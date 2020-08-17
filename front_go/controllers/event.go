package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gofiber/fiber"
	"raas.com/api/v1/db"
	"raas.com/api/v1/models"
)

var ctx = context.Background()

type EventInput struct {
	Type     string  `json:"type" binding:"required"`
	Actor    string  `json:"actor" binding:"required"`
	Item     string  `json:"item" binding:"required"`
	Data     float64 `json:"data" binding:"required"`
	Provider string  `json:"provider" binding:"required"`
}

// POST /event
func SaveEvent(c *fiber.Ctx) {
	input := new(EventInput)
	if err := c.BodyParser(input); err != nil {
		c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
		return
	}

	event := models.Event{
		Type:     input.Type,
		Actor:    input.Actor,
		Item:     input.Item,
		Data:     input.Data,
		Provider: input.Provider}

	db.DB.Create(&event)

	key := fmt.Sprintf("is_active:%v_%v", input.Provider, input.Actor)

	isRecentlyActive, err := db.RDB.Get(ctx, key).Result()
	if err != nil || isRecentlyActive == "true" {
		db.RDB.Set(ctx, key, "true", 5*time.Minute)
		// Add new computation task to queue
		task := &models.Task{Actor: input.Actor, Provider: input.Provider}
		json_task, _ := json.Marshal(task)
		db.RDB.RPush(ctx, "queue:compute", string(json_task))
		fmt.Println("Stored in Redis queue.")
	}

	c.Status(200).JSON(fiber.Map{"data": "success"})
}
