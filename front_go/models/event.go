package models

import "github.com/jinzhu/gorm"

type Event struct {
	gorm.Model
	Type     string
	Actor    string
	Item     string
	Data     float64
	Provider string
}
