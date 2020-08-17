package db

import (
	"github.com/go-redis/redis/v8"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"raas.com/api/v1/models"
)

var DB *gorm.DB
var RDB *redis.Client

func ConnectDatabase() {
	// DBURL := fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=disable password=%s", DbHost, DbPort, DbUser, DbName, DbPassword)
	database, err := gorm.Open("postgres", "host=postgres-server sslmode=disable port=5432 user=unicorn_user dbname=rainbow_database password=magical_password")

	if err != nil {
		panic(err)
	}

	if !database.HasTable("actors") {
		database.CreateTable(&models.Actor{})
	}
	if !database.HasTable("events") {
		database.CreateTable(&models.Event{})
	}
	if !database.HasTable("recommendations") {
		database.CreateTable(&models.Recommendation{})
	}

	rdb := redis.NewClient(&redis.Options{
		Addr:     "redis-server:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	DB = database
	RDB = rdb
}
