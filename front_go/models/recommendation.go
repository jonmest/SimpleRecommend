package models

import "github.com/jinzhu/gorm"

type Recommendation struct {
	gorm.Model
	Provider string
	Actor    string
	Items    []string
}
