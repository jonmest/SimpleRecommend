package main

import (
	"context"
	"os"
	"raas.com/api/v1/utils"

	"github.com/gofiber/fiber"
	"github.com/gofiber/fiber/middleware"
	"raas.com/api/v1/controllers"
	"raas.com/api/v1/db"
)

var ctx = context.Background()

func main() {
	app := fiber.New()
	app.Use(middleware.Logger(middleware.LoggerConfig{
		TimeFormat: "15:04:05",
		Output:     os.Stdout,
	}))

	app.Use(func(c *fiber.Ctx) {
		apiKey := c.Get("Api-Key")
		payload, err := utils.DecryptAPIToken(apiKey)
		if err != nil {
			c.Status(401).JSON(fiber.Map{
				"message": "You provided an invalid API key.",
			})
		}
		c.Locals("providerPayload", payload)
		c.Next()
	})

	db.ConnectDatabase()

	app.Post("/token", controllers.Token)
	app.Post("/event", controllers.SaveEvent)
	app.Get("/recommendations", controllers.GetRecommendations)
	app.Listen(8080)
}
