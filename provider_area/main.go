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
	account.Post("/", controllers.CreateAccountAndCustomer)

	// Protected
	account.Get("/", mymw.Protected(), controllers.GetUser)
	account.Patch("/", mymw.Protected(), controllers.UpdateUser)
	account.Delete("/", mymw.Protected(), controllers.DeleteAccount)

	account.Post("/subscribe/", mymw.Protected(), controllers.HandleCreateSubscription)

	items := account.Group("/items")
	items.Post("/", mymw.Protected(), controllers.PostItems)
	items.Get("/", mymw.Protected(), controllers.GetItems)
	items.Patch("/", mymw.Protected(), controllers.UpdateItems)
	items.Delete("/", mymw.Protected(), controllers.DeleteItems)

	app.Listen(8080)
}
