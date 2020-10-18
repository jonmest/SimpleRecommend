package controllers

import (
	"github.com/gofiber/fiber"
	"raas.com/api/v1/db"
	"raas.com/api/v1/models"
	"raas.com/api/v1/util"
)

func PostToken(c *fiber.Ctx) {
	input := new(models.TokenRequest)
	if err := c.BodyParser(input); err != nil {
		c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
		return
	}

	var provider models.Provider
	db.DB.Where("username = ?", input.Provider).First(&provider)

	token, err := util.GenerateRandomString(32)
	if err != nil {
		c.Status(500).JSON(fiber.Map{"message": "Failed to create token."})
		return
	}

	actor := models.Actor{ID: token, Provider: input.Provider}
	db.DB.Create(&actor)
	c.Status(200).JSON(fiber.Map{"actor_token": token})
}
