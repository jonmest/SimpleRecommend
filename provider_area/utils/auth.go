package utils

import (
	"fmt"
	"provider-area/db"
	"provider-area/models"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

func GetUserIdFromToken(c *fiber.Ctx) string {
	token := c.Locals("user").(*jwt.Token)
	claims := token.Claims.(jwt.MapClaims)
	id := claims["user_id"].(float64)
	return fmt.Sprintf("%d", uint(id))
}

// CheckPasswordHash compare password with hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func GetUserByEmail(e string) (*models.Provider, error) {
	db := db.DB
	var user models.Provider
	if err := db.Where(&models.Provider{Email: e}).Find(&user).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func GetUserByUsername(u string) (*models.Provider, error) {
	db := db.DB
	var user models.Provider
	if err := db.Where(&models.Provider{Username: u}).Find(&user).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}
