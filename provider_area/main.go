package main

import (
	"context"

	"provider-area/controllers"
	"provider-area/db"

	mymw "provider-area/middleware"

	"github.com/gofiber/cors"
	"github.com/gofiber/fiber"
)

var ctx = context.Background()

func main() {
	app := fiber.New()
	app.Use(cors.New())
	// app.Use(middleware.Logger(middleware.LoggerConfig{
	// 	TimeFormat: "15:04:05",
	// 	Output:     os.Stdout,
	// }))

	db.ConnectDatabase()

	app.Post("/login", controllers.Login)

	// Account section
	account := app.Group("/account")
	account.Post("/", controllers.CreateAccount)

	// Protected
	account.Get("/:id", mymw.Protected(), controllers.GetUser)
	account.Patch("/:id", mymw.Protected(), controllers.UpdateUser)
	account.Delete("/:id", mymw.Protected(), controllers.DeleteAccount)

	items := account.Group("/items")
	items.Post("/:id", mymw.Protected(), controllers.PostItems)
	items.Get("/:id", mymw.Protected(), controllers.GetItems)
	items.Delete("/:id", mymw.Protected(), controllers.DeleteItems)

	app.Listen(8080)
}
