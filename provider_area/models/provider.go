package models

import "github.com/jinzhu/gorm"

type Provider struct {
	gorm.Model
	Username         string  `gorm:"unique_index;not null" json:"username"`
	Email            string  `gorm:"unique_index;not null" json:"email"`
	PasswordHash     string  `gorm:"not null" json:"-"`
	Plan             string  `gorm:"type:text" json:"plan"`
	Active           bool    `gorm:"type:boolean" json:"active"`
	StripeCustomerId string  `gorm:"type:text" json:"-"`
	SubscriptionID   string  `gorm:"type:text" json:"-"`
	Max_Rating       float64 `gorm:"type:real" json:"max_rating"`
	Min_Rating       float64 `gorm:"type:real" json:"min_rating"`
	Domain           string  `gorm:"type:text" json:"domain"`
}
