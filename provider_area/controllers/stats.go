package controllers

import (
	"fmt"
	"provider-area/db"
	"provider-area/models"
	util "provider-area/utils"
	"time"

	"github.com/gofiber/fiber"
)

func GetStats(c *fiber.Ctx) {
	// To return in response
	type Stats struct {
		UniqueUsersTotal     uint           `json:"unique_users_total"`
		UniqueUsersLastMonth uint           `json:"unique_users_last_month"`
		LastError            models.Error   `json:"last_error"`
		AllErrors            []models.Error `json:"all_errors"`
	}

	id := util.GetUserIdFromToken(c)
	db := db.DB

	var user models.Provider
	db.Find(&user, id)
	if user.Username == "" {
		c.Status(404).JSON(fiber.Map{"status": "error", "message": "No user found with ID", "data": nil})
		return
	}

	t := time.Now()
	year := t.Year()        // type int
	month := int(t.Month()) // type time.Month
	day := t.Day()
	dateString := fmt.Sprintf("%d-%d-%d", year, month, day)
	var uniqueActorsLastMonth int
	db.Raw("SELECT COUNT(DISTINCT actor) FROM events WHERE provider = ? AND created_at >= TO_DATE(?,'YYYY-MM-DD')", user.Username, dateString).Scan(&uniqueActorsLastMonth)

	c.JSON(fiber.Map{"status": "success", "message": "User found", "data": user})
}
