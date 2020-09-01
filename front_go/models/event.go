package models

import "github.com/jinzhu/gorm"

type Event struct {
	gorm.Model
	Label     string
	Actor    string
	Item     string
	Data     float64
	Provider string
}
