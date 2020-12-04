package db

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"raas.com/api/v1/models"
	"raas.com/api/v1/models/event"
)

var DB *gorm.DB

func ConnectDatabase() {
	// DBURL := fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=disable password=%s", DbHost, DbPort, DbUser, DbName, DbPassword)
	database, err := gorm.Open("postgres", "host=postgres sslmode=disable port=5432 user=unicorn_user dbname=rainbow_database password=magical_password")

	if err != nil {
		panic(err)
	}

	database.AutoMigrate(&models.Actor{}, &event.Event{}, &models.Recommendation{})

	DB = database
}
