package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

type Recommendation struct {
	gorm.Model
	Provider string `json:"-"`
	Actor    string `json:"-"`
	Items    string `json:"items"`
	Created  time.Time
}
