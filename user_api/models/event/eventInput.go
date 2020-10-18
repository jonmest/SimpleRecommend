package event

type EventInput struct {
	Label string   `json:"label"`
	Actor *string  `json:"actor" binding:"required"`
	Item  *string  `json:"item" binding:"required"`
	Data  *float64 `json:"data" binding:"required"`
}
