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
		UniqueUsersTotal     uint         `json:"unique_users_total"`
		UniqueUsersLastMonth uint         `json:"unique_users_last_month"`
		LastError            models.Error `json:"current_error"`
	}

	id := util.GetUserIdFromToken(c)
	db := db.DB

	var user models.Provider
	db.Find(&user, id)
	if user.Username == "" {
		c.Status(404).JSON(fiber.Map{"status": "error", "message": "No user found with ID", "data": nil})
		return
	}

	// Unique users last 30 days
	var dateString string = get30DaysBackString()
	var uniqueActorsLastMonth struct {
		Count uint
	}
	fmt.Println(dateString)
	db.Raw("SELECT COUNT(DISTINCT actor) FROM events WHERE provider = ? AND created_at >= TO_DATE(?,'YYYY/MM/DD HH24:MI:SS')", user.Username, dateString).Scan(&uniqueActorsLastMonth)

	// Unique users total
	var uniqueActorsTotal struct {
		Count uint
	}
	db.Raw("SELECT COUNT(DISTINCT actor) FROM events WHERE provider = ?", user.Username).Scan(&uniqueActorsTotal)

	// Get Last error
	var lastError models.Error
	db.Raw("SELECT * FROM errors WHERE provider = ? ORDER BY created_at DESC LIMIT 1", user.Username).Scan(&lastError)

	stats := Stats{
		UniqueUsersTotal:     uniqueActorsTotal.Count,
		UniqueUsersLastMonth: uniqueActorsLastMonth.Count,
		LastError:            lastError,
	}
	// Get all Errors
	c.JSON(fiber.Map{"status": "success", "message": "User found", "data": stats})
}
