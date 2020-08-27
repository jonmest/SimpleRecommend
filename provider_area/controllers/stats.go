package controllers

import (
	"fmt"
	"provider-area/db"
	"provider-area/models"
	util "provider-area/utils"
	"time"

	"github.com/gofiber/fiber"
)

func get30DaysBackString() string {
	t := time.Now()
	t2 := t.AddDate(0, -1, 0)
	return fmt.Sprintf("%d/%d/%d %d:%d:%d", t2.Year(), t2.Month(), t2.Day(), t2.Hour(), t2.Minute(), t2.Second()) // One month before now
}

func GetStats(c *fiber.Ctx) {
	// To return in response
	type Stats struct {
		UniqueUsersTotal     uint           `json:"unique_users_total"`
		UniqueUsersLastMonth uint           `json:"unique_users_last_month"`
		LastError            models.Error   `json:"current_error"`
		AllError             []models.Error `json:"errors_history"`
	}

	id := util.GetUserIdFromToken(c)
	db := db.DB

	var user models.Provider
	db.Find(&user, id)
	if user.Username == "" {
		c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Unauthorized request. Must provide a valid token in authorization header."})
		return
	}

	// Unique users last 30 days
	var dateString string = get30DaysBackString()
	var uniqueActorsLastMonth struct {
		Count uint
	}
	db.Raw("SELECT COUNT(DISTINCT actor) FROM events WHERE provider = ? AND created_at >= TO_DATE(?,'YYYY/MM/DD HH24:MI:SS')", user.Username, dateString).Scan(&uniqueActorsLastMonth)

	// Unique users total
	var uniqueActorsTotal struct {
		Count uint
	}
	db.Raw("SELECT COUNT(DISTINCT actor) FROM events WHERE provider = ?", user.Username).Scan(&uniqueActorsTotal)

	// Get Last error
	var lastError models.Error
	db.Raw("SELECT * FROM errors WHERE provider = ? ORDER BY created_at DESC LIMIT 1", user.Username).Scan(&lastError)

	var allErrors []models.Error
	if c.Query("errors") == "all" {
		db.Raw("SELECT * FROM errors WHERE provider = ?", user.Username).Scan(&allErrors)
	}

	stats := Stats{
		UniqueUsersTotal:     uniqueActorsTotal.Count,
		UniqueUsersLastMonth: uniqueActorsLastMonth.Count,
		LastError:            lastError,
		AllError:             allErrors,
	}
	// Get all Errors
	c.Status(200).JSON(fiber.Map{"status": "success", "data": stats})
}
