package main

import (
	"os"

	"raas.com/api/v1/db"
	"raas.com/api/v1/utils"

	"github.com/gofiber/fiber"
	"github.com/gofiber/fiber/middleware"
	"raas.com/api/v1/controllers"
)

func main() {
	db.ConnectDatabase()

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
			return
		}

		c.Locals("providerPayload", payload)
		c.Next()
	})

	app.Post("/token", controllers.PostToken)
	app.Post("/event", controllers.PostEvent)
	app.Get("/recommendations", controllers.GetRecommendations)
	app.Listen(8080)
}
