package controllers

import (
	"provider-area/db"
	"provider-area/models"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber"
)

// DeleteUser delete user
func GetItems(c *fiber.Ctx) {
	id := c.Params("id")
	token := c.Locals("user").(*jwt.Token)

	if !validToken(token, id) {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid token id", "data": nil})
		return
	}

	db := db.DB
	var user models.Provider
	var items []models.Item
	db.First(&user, id)
	db.Find(&items).Where("provider = ?", user.Username)

	c.JSON(fiber.Map{"status": "success", "message": "Items from account successfully fetched.", "data": items})
}

func PostItems(c *fiber.Ctx) {
	type ItemsInput struct {
		Items []models.Item `json:"items"`
	}
	var it ItemsInput
	if err := c.BodyParser(&it); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})
		return
	}
	id := c.Params("id")
	token := c.Locals("user").(*jwt.Token)

	if !validToken(token, id) {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid token id", "data": nil})
		return
	}

	db := db.DB
	var user models.Provider
	db.First(&user, id)

	for _, value := range it.Items {
		value.Provider = user.Username
		db.Create(&value)
	}

	c.JSON(fiber.Map{"status": "success", "message": "Items from account successfully created.", "data": nil})
}

func UpdateItems(c *fiber.Ctx) {
	type UpdateItemInput struct {
		Items []models.Item `json:"items"`
	}
	var uii UpdateItemInput
	if err := c.BodyParser(&uii); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})
		return
	}
	id := c.Params("id")
	token := c.Locals("user").(*jwt.Token)

	if !validToken(token, id) {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid token id", "data": nil})
		return
	}

	db := db.DB

	for _, val := range uii.Items {
		var item models.Item
		db.First(&item, val.Iid)
		item.Category = val.Category
		db.Save(&item)
	}

	c.JSON(fiber.Map{"status": "success", "message": "Items successfully updated", "data": nil})
}

func DeleteItems(c *fiber.Ctx) {
	type DeleteInput struct {
		ItemIids []string `json:"items"`
	}

	var di DeleteInput
	if err := c.BodyParser(&di); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})
		return
	}
	id := c.Params("id")
	token := c.Locals("user").(*jwt.Token)

	if !validToken(token, id) {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid token id", "data": nil})
		return
	}

	for _, value := range di.ItemIids {
		db.DB.Where("iid = ?", value).Delete(&models.Item{})
	}
	c.JSON(fiber.Map{"status": "success", "message": "Items from with specified IDs successfully deleted.", "data": nil})

}