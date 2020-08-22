package controllers

import (
	"os"
	"provider-area/db"
	"provider-area/models"
	util "provider-area/utils"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber"
	"github.com/stripe/stripe-go/v71"
	"github.com/stripe/stripe-go/v71/customer"
	"github.com/stripe/stripe-go/v71/paymentmethod"
	"github.com/stripe/stripe-go/v71/sub"
)

func HandleCreateSubscription(c *fiber.Ctx) {
	var req struct {
		PaymentMethodID string `json:"paymentMethodId"`
		PriceID         string `json:"priceId"`
	}

	id := c.Params("id")
	token := c.Locals("user").(*jwt.Token)
	db := db.DB

	if !util.ValidToken(token, id) {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid token id", "data": nil})
		return
	}

	var user models.Provider
	db.Find(&user, id)
	if user.Username == "" {
		c.Status(404).JSON(fiber.Map{"status": "error", "message": "No user found with ID", "data": nil})
		return
	}

	if err := c.BodyParser(&req); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review input", "data": err})
		return
	}

	params := &stripe.PaymentMethodAttachParams{
		Customer: stripe.String(user.StripeCustomerId),
	}
	pm, err := paymentmethod.Attach(
		req.PaymentMethodID,
		params,
	)
	if err != nil {
		c.Status(500)
		return
	}

	customerParams := &stripe.CustomerParams{
		InvoiceSettings: &stripe.CustomerInvoiceSettingsParams{
			DefaultPaymentMethod: stripe.String(pm.ID),
		},
	}
	_, err = customer.Update(
		user.StripeCustomerId,
		customerParams,
	)
	if err != nil {
		c.Status(500)
		return
	}
	// Create subscription
	subscriptionParams := &stripe.SubscriptionParams{
		Customer: stripe.String(user.StripeCustomerId),
		Items: []*stripe.SubscriptionItemsParams{
			{
				Plan: stripe.String(os.Getenv(req.PriceID)),
			},
		},
	}
	subscriptionParams.AddExpand("latest_invoice.payment_intent")
	s, err := sub.New(subscriptionParams)
	if err != nil {
		c.Status(500)
		return
	}

	c.Status(200).JSON(fiber.Map{"status": "success", "subscription": s})
}
