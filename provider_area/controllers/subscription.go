package controllers

import (
	"provider-area/db"
	"provider-area/models"
	util "provider-area/utils"

	"github.com/gofiber/fiber"
	"github.com/stripe/stripe-go/v71"
	"github.com/stripe/stripe-go/v71/invoice"

	"github.com/stripe/stripe-go/v71/customer"
	"github.com/stripe/stripe-go/v71/paymentmethod"
	"github.com/stripe/stripe-go/v71/sub"
)

func HandleCreateSubscription(c *fiber.Ctx) {
	var req struct {
		PaymentMethodID string `json:"paymentMethodId"`
		PriceID         string `json:"priceId"`
	}

	id := util.GetUserIdFromToken(c)
	db := db.DB

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
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Could not create payment method", "data": err})
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
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Could not update customer", "data": err})
		return
	}
	// Create subscription
	subscriptionParams := &stripe.SubscriptionParams{
		Customer: stripe.String(user.StripeCustomerId),
		Items: []*stripe.SubscriptionItemsParams{
			{
				Plan: stripe.String(req.PriceID),
			},
		},
	}
	subscriptionParams.AddExpand("latest_invoice.payment_intent")
	s, err := sub.New(subscriptionParams)
	if err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Could not create subscription", "data": err})
		return
	}

	user.SubscriptionID = s.ID
	db.Save(&user)

	c.Status(200).JSON(fiber.Map{"status": "success", "subscription": s})
}

func HandleRetryInvoice(c *fiber.Ctx) {
	var input struct {
		CustomerID      string `json:"customerId"`
		PaymentMethodID string `json:"paymentMethodId"`
		InvoiceID       string `json:"invoiceId"`
	}

	if err := c.BodyParser(&input); err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review input", "data": err})
		return
	}

	// Attach PaymentMethod
	params := &stripe.PaymentMethodAttachParams{
		Customer: stripe.String(input.CustomerID),
	}
	pm, err := paymentmethod.Attach(
		input.PaymentMethodID,
		params,
	)
	if err != nil {
		c.Status(500)
		return
	}

	// Update invoice settings default
	customerParams := &stripe.CustomerParams{
		InvoiceSettings: &stripe.CustomerInvoiceSettingsParams{
			DefaultPaymentMethod: stripe.String(pm.ID),
		},
	}
	_, err = customer.Update(
		input.CustomerID,
		customerParams,
	)

	if err != nil {
		c.Status(500)
		return
	}

	// Retrieve Invoice
	invoiceParams := &stripe.InvoiceParams{}
	invoiceParams.AddExpand("payment_intent")
	in, err := invoice.Get(
		input.InvoiceID,
		invoiceParams,
	)

	if err != nil {
		c.Status(500)
		return
	}

	c.Status(200).JSON(fiber.Map{"status": "success", "data": in})
}

func CancelSubscription(c *fiber.Ctx) {
	id := util.GetUserIdFromToken(c)
	db := db.DB

	var user models.Provider
	db.Find(&user, id)
	if user.Username == "" {
		c.Status(404).JSON(fiber.Map{"status": "error", "message": "No user found with ID", "data": nil})
		return
	}

	s, err := sub.Cancel(user.SubscriptionID, nil)
	if err != nil {
		c.Status(500).JSON(fiber.Map{"status": "error", "message": "Failed to cancel subscription", "data": nil})

		return
	}

	user.SubscriptionID = ""
	user.Plan = ""
	user.Active = false
	db.Save(&user)

	c.Status(200).JSON(fiber.Map{"status": "success", "data": s})
}
