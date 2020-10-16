package controllers

import (
	"encoding/json"
	"fmt"
	"os"
	"provider-area/db"
	"provider-area/models"

	"github.com/gofiber/fiber"
	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/customer"
)

func WebHook(c *fiber.Ctx) {
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
	event := stripe.Event{}

	if err := c.BodyParser(&event); err != nil {
		c.SendStatus(fiber.StatusBadRequest)
		return
	}

	switch event.Type {
	case "checkout.session.completed":
		var session stripe.CheckoutSession
		err := json.Unmarshal(event.Data.Raw, &session)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error parsing webhook JSON: %v\\n", err)
			c.SendStatus(fiber.StatusBadRequest)
			return
		}
		stripeCustomerId := session.Customer.ID
		stripeSubID := session.Subscription.ID
		cus, _ := customer.Get(stripeCustomerId, nil)

		fmt.Println(cus.Email)
		provider := models.Provider{}
		db.DB.Model(&provider).Where("email = ?", cus.Email).Update(models.Provider{Active: true, StripeCustomerID: stripeCustomerId, SubscriptionID: stripeSubID})
		c.SendStatus(200)
		return

	default:
		fmt.Fprintf(os.Stderr, "Unexpected event type: %s\\n", event.Type)
		c.SendStatus(fiber.StatusBadRequest)
		return
	}

}
