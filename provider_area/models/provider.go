package models

import "github.com/jinzhu/gorm"

type Provider struct {
	gorm.Model
	Username         string `gorm:"unique_index;not null"`
	Email            string `gorm:"unique_index;not null"`
	PasswordHash     string `gorm:"not null" json:"-"`
	Plan             string `gorm:"type:text"`
	TypeOfUserData   string `gorm:"type:text"`
	Active           bool   `gorm:"type:boolean"`
	StripeCustomerId string `gorm:"type:text" json:"-"`
	SubscriptionID   string `gorm:"type:text" json:"-"`
}
