package models

type Event struct {
	Type     string  `json:"type" binding:"required"`
	Actor    string  `json:"actor" binding:"required"`
	Item     string  `json:"item" binding:"required"`
	Data     float64 `json:"data" binding:"required"`
	Provider string  `json:"provider" binding:"required"`
}
