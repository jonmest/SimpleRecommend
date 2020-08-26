package models

import "github.com/jinzhu/gorm"

type Error struct {
	gorm.Model
	Provider string  `gorm:"not null" json:"-"`
	Type     string  `gorm:"not null" json:"type"`
	Data     float64 `gorm:"real" json:"data"`
}
