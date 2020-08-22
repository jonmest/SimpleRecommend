package controllers

import (
	"os"

	"github.com/gofiber/fiber"
	"github.com/stripe/stripe-go/v71"
	"github.com/stripe/stripe-go/v71/customer"
	"github.com/stripe/stripe-go/v71/paymentmethod"
	"github.com/stripe/stripe-go/v71/sub"
)

func HandleCreateCustomer(c *fiber.Ctx) {
	var req struct {
		Email string `json:"email"`
	}

	if err := c.BodyParser(&req); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review input", "data": err})
		return
	}
	params := &stripe.CustomerParams{
		Email: stripe.String(req.Email),
	}

	cus, err := customer.New(params)
	if err != nil {
		c.Status(500)
		return
	}
	c.Status(200).JSON(fiber.Map{
		"status": "success",
		"data": struct {
			Customer *stripe.Customer `json:"customer"`
		}{
			Customer: cus,
		}})
}

func HandleCreateSubscription(c *fiber.Ctx) {
	var req struct {
		PaymentMethodID string `json:"paymentMethodId"`
		CustomerID      string `json:"customerId"`
		PriceID         string `json:"priceId"`
	}

	if c.Method() != "POST" {
		c.Status(500)
		return
	}

	if err := c.BodyParser(&req); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review input", "data": err})
		return
	}

	params := &stripe.PaymentMethodAttachParams{
		Customer: stripe.String(req.CustomerID),
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
		req.CustomerID,
		customerParams,
	)
	if err != nil {
		c.Status(500)
		return
	}
	// Create subscription
	subscriptionParams := &stripe.SubscriptionParams{
		Customer: stripe.String(req.CustomerID),
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
