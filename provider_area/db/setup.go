package db

import (
	"provider-area/models"

	"github.com/go-redis/redis/v8"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var DB *gorm.DB
var RDB *redis.Client

func ConnectDatabase() {
	// DBURL := fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=disable password=%s", DbHost, DbPort, DbUser, DbName, DbPassword)
	database, err := gorm.Open("postgres", "host=postgres-server sslmode=disable port=5432 user=unicorn_user dbname=rainbow_database password=magical_password")

	if err != nil {
		panic(err)
	}

	database.AutoMigrate(&models.Provider{})

	rdb := redis.NewClient(&redis.Options{
		Addr:     "redis-server:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	if err != nil {
		panic(err)
	}

	DB = database
	RDB = rdb
}
