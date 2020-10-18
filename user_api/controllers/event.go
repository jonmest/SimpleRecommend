package controllers

import (
	"context"

	"raas.com/api/v1/utils"

	"github.com/gofiber/fiber"
	"raas.com/api/v1/db"
	"raas.com/api/v1/models/event"
)

var ctx = context.Background()

type EventInput = event.EventInput

// POST /event
func PostEvent(c *fiber.Ctx) {
	input := new(EventInput)
	payload := c.Locals("providerPayload").(utils.Payload)

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

	event := event.Event{
		Label:    input.Label,
		Actor:    *input.Actor,
		Item:     *input.Item,
		Data:     *input.Data,
		Provider: payload.Username,
	}

	db.DB.Create(&event)

	c.Status(200).JSON(fiber.Map{"data": "success"})
}
