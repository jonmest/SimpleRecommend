package main

import (
	"encoding/json"
	"fmt"
	"os"
	"raas.com/api/v1/db"
	"raas.com/api/v1/models"
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
		fmt.Println(payload)
		fmt.Print(err)
		c.Locals("providerPayload", payload)
		c.Next()
	})

	app.Use(func(c *fiber.Ctx) {
		payload := c.Locals("providerPayload").(utils.Payload)
		var provider models.Provider
		db.DB.Where(
			"email = ? AND username = ?",
			payload.Email, payload.Username,
		).First(&provider)

		var hostnames []string
		json.Unmarshal([]byte(provider.Hostnames), &hostnames)

		host := c.Hostname()
		origin := c.Get(fiber.HeaderOrigin)
		ipList := c.IPs()

		fmt.Println(host)
		fmt.Println(origin)
		fmt.Println(ipList)
		
		for _, item := range hostnames {
			if host == item || origin == item {
				c.Next()
				return
			}
			if utils.MatchSubdomain(origin, item) || utils.MatchSubdomain(host, item) {
				c.Next()
				return
			}

			for _, ip := range ipList {
				if ip == item {
					c.Next()
					return
				}
			}
		}

		c.Status(401).JSON(fiber.Map{
			"message": "You sent a request from a non-whitelisted hostname.",
		})
		return
	})


	app.Post("/token", controllers.Token)
	app.Post("/event", controllers.SaveEvent)
	app.Get("/recommendations", controllers.GetRecommendations)
	app.Listen(8080)
}
