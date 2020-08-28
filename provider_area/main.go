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
	app.Post("/webhook", controllers.WebHook)

	// Account section
	account := app.Group("/account")
	account.Post("/", controllers.CreateAccount)

	// Protected
	account.Get("/", mymw.Protected(), controllers.GetUser)
	account.Patch("/", mymw.Protected(), controllers.UpdateUser)
	account.Delete("/", mymw.Protected(), controllers.DeleteAccount)
	account.Get("/statistics", mymw.Protected(), controllers.GetStats)
	account.Post("/session", mymw.Protected(), controllers.HandleCreateSession)
	app.Post("/verify-email", mymw.Protected(), controllers.RequestVerifyEmail)
	app.Post("/verify-email-token", controllers.VerifyEmailWithToken)
	app.Listen(8080)
}
