package main

import (
	"context"
	"os"

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

	db.ConnectDatabase()

	app.Post("/token", controllers.Token)
	app.Post("/event", controllers.SaveEvent)
	app.Get("/recommendations", controllers.GetRecommendations)
	app.Listen(8080)
}
