package models

import "github.com/jinzhu/gorm"

type Error struct {
	gorm.Model
	Provider string  `gorm:"not null" json:"-"`
	MeanRMSE float64 `gorm:"real;column:mean_rmse" json:"mean_rmse"`
	StdRMSE  float64 `gorm:"real;column:std_rmse" json:"std_rmse"`
	MeanMAE  float64 `gorm:"real;column:mean_mae" json:"mean_mae"`
	StdMAE   float64 `gorm:"real;column:std_mae" json:"std_mae"`
	MeanFCP  float64 `gorm:"real;column:mean_fcp" json:"mean_fcp"`
	StdFCP   float64 `gorm:"real;column:std_fcp" json:"std_fcp"`
}
