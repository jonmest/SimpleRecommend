package models

type Item struct {
	ID       string `gorm:"type:text"`
	Category string `gorm:"type:text"`
}
