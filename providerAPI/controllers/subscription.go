package controllers

import (
	"os"

	"github.com/gofiber/fiber"
	"github.com/stripe/stripe-go/v71"
	"github.com/stripe/stripe-go/v71/checkout/session"
)

func HandleCreateSession(c *fiber.Ctx) {
	var req struct {
		PriceID string `json:"priceId"`
		Email   string `json:"email"`
	}
	if err := c.BodyParser(&req); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review input", "data": err})
		return
	}

	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	params := &stripe.CheckoutSessionParams{
		CustomerEmail: &req.Email,
		PaymentMethodTypes: stripe.StringSlice([]string{
			"card",
		}),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			&stripe.CheckoutSessionLineItemParams{
				Price:    stripe.String(req.PriceID),
				Quantity: stripe.Int64(1),
			},
		},
		Mode:       stripe.String("subscription"),
		SuccessURL: stripe.String(os.Getenv("FRONTEND_URL") + "/success?session_id={CHECKOUT_SESSION_ID}"),
		CancelURL:  stripe.String(os.Getenv("FRONTEND_URL") + "/cancel"),
	}
	session, err := session.New(params)
	if err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Could not create Stripe session", "data": err})
		return
	}

	c.Status(200).JSON(fiber.Map{"status": "success", "data": session})
}
