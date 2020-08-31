package utils

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"provider-area/db"
	"provider-area/models"
	"strconv"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

func GenerateRandomBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	// Note that err == nil only if we read len(b) bytes.
	if err != nil {
		return nil, err
	}

	return b, nil
}

// GenerateRandomString returns a URL-safe, base64 encoded
// securely generated random string.
func GenerateRandomString(s int) (string, error) {
	b, err := GenerateRandomBytes(s)
	return base64.URLEncoding.EncodeToString(b), err
}

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
	var user models.Provider
	db.DB.First(&user, id)
	fmt.Printf("%+v\n", user)
	if !CheckPasswordHash(p, user.PasswordHash) {
		return false
	}
	return true
}
