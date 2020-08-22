package utils

import (
	"fmt"
	"provider-area/db"
	"provider-area/models"
	"strconv"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func ValidToken(t *jwt.Token, id string) bool {
	n, err := strconv.Atoi(id)
	if err != nil {
		return false
	}

	claims := t.Claims.(jwt.MapClaims)
	uid := int(claims["user_id"].(float64))

	if uid != n {
		return false
	}

	return true
}

func ValidUser(id string, p string) bool {
	db := db.DB
	var user models.Provider
	db.First(&user, id)
	fmt.Printf("%+v\n", user)
	if !CheckPasswordHash(p, user.PasswordHash) {
		return false
	}
	return true
}
