package main

import (
	"context"
	"os"

	"provider-area/controllers"
	"provider-area/db"

	mymw "provider-area/middleware"

	"github.com/gofiber/cors"
	"github.com/gofiber/fiber"
	"github.com/gofiber/fiber/middleware"
)

var ctx = context.Background()

func main() {
	app := fiber.New()
	app.Use(cors.New())
	app.Use(middleware.Logger(middleware.LoggerConfig{
		TimeFormat: "15:04:05",
		Output:     os.Stdout,
	}))

	db.ConnectDatabase()

	app.Post("/login", controllers.Login)

	// Account section
	account := app.Group("/account")
	account.Post("/", controllers.CreateAccount)

	// Protected
	account.Get("/:id", mymw.Protected(), controllers.GetUser)
	account.Patch("/:id", mymw.Protected(), controllers.UpdateUser)
	account.Delete("/:id", mymw.Protected(), controllers.DeleteAccount)

	app.Listen(8080)
}