package models

type Actor struct {
	ID       string `gorm:"type:text"`
	Provider string `gorm:"type:text"`
}
