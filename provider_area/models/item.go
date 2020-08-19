package models

import "github.com/jinzhu/gorm"

type Item struct {
	gorm.Model `json:"-"`
	Iid        string `gorm:"type:text" json:"id" binding:"required"`
	Category   string `gorm:"type:text" json:"category" binding:"required"`
	Provider   string `gorm:"type:text" json:"-"`
}
