package controllers

import (
	"github.com/gofiber/fiber"
	"raas.com/api/v1/models"
)

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
	c.Status(200).JSON(fiber.Map{"data": "success"})
}
