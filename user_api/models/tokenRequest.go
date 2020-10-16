package models

type TokenRequest struct {
	Provider string `json:"provider" binding:"required"`
}
