package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gofiber/fiber"
	"raas.com/api/v1/models"
)

var ctx = context.Background()

type Task struct {
	Actor    string `json:"actor"`
	Provider string `json:"provider"`
}

// POST /event
func SaveEvent(c *fiber.Ctx) {
	input := new(models.Event)
	if err := c.BodyParser(input); err != nil {
		c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
		return
	}
	models.DB.Exec(
		`INSERT INTO events (type, actor, item, data, provider) 
		VALUES ($1, $2, $3, $4, $5);`,
		input.Type, input.Actor, input.Item,
		input.Data, input.Provider)

	key := fmt.Sprintf("is_active_%v_%v", input.Provider, input.Actor)
	isRecentlyActive, err := models.RDB.Get(ctx, key).Result()
	if err != nil {
		models.RDB.Set(ctx, key, "true", 5*time.Minute)
		// Compute new recommendations
		task := &Task{Actor: input.Actor, Provider: input.Provider}
		json_task, _ := json.Marshal(task)
		models.RDB.Set(ctx, "compute_task_queue", string(json_task), 5*time.Minute)
	}

	c.Status(200).JSON(fiber.Map{"data": "success"})
}
