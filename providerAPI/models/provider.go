package models

import "github.com/jinzhu/gorm"

// Provider ...
type Provider struct {
	gorm.Model
	Username         string   `gorm:"unique_index;not null" json:"username"`
	Email            string   `gorm:"unique_index;not null" json:"email"`
	PasswordHash     string   `gorm:"not null" json:"-"`
	Plan             string   `gorm:"type:text" json:"plan"`
	Active           bool     `gorm:"type:boolean" json:"active"`
	StripeCustomerID string   `gorm:"type:text" json:"-"`
	SubscriptionID   string   `gorm:"type:text" json:"-"`
	MaxRating        float64  `gorm:"type:real" json:"max_rating"`
	MinRating        float64  `gorm:"type:real" json:"min_rating"`
	Hostnames        string `gorm:"type:text" json:"hostnames"`
	VerifiedEmail    bool     `gorm:"type:boolean" json:"verified"`
	ApiKey           string   `gorm:"type:text" json:"-"`
	ApiKeyRequired   bool     `gorm:"type:boolean" json:"api_key_required"`
}
