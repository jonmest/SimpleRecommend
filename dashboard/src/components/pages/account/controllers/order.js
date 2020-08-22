import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

function initiateCheckout(customerId, priceId, userId){
      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const cardElement = elements.getElement(CardElement);

      // If a previous payment was attempted, get the latest invoice
      const latestInvoicePaymentIntentStatus = localStorage.getItem(
        'latestInvoicePaymentIntentStatus'
      );

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.log('[createPaymentMethod error]', error);
      } else {
        console.log('[PaymentMethod]', paymentMethod);
        const paymentMethodId = paymentMethod.id;
        if (latestInvoicePaymentIntentStatus === 'requires_payment_method') {
          // Update the payment method and retry invoice payment
          const invoiceId = localStorage.getItem('latestInvoiceId');
          retryInvoiceWithNewPaymentMethod({
            userId,
            customerId,
            paymentMethodId,
            invoiceId,
            priceId,
          });
        } else {
          // Create the subscription
          createSubscription({ userId, customerId, paymentMethodId, priceId });
        }
      }
  }

  function createSubscription({ userId, customerId, paymentMethodId, priceId }) {
    return (
      fetch(process.env.REACT_APP_PROVIDER_API_URL + '/account/subscribe/' + userId, {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          paymentMethodId: paymentMethodId,
          priceId: priceId,
        }),
      })
        .then((response) => {
          return response.json();
        })
        // If the card is declined, display an error to the user.
        .then((result) => {
          if (result.error) {
            // The card had an error when trying to attach it to a customer.
            throw result;
          }
          return result;
        })
        // Normalize the result to contain the object returned by Stripe.
        // Add the additional details we need.
        .then((result) => {
          return {
            paymentMethodId: paymentMethodId,
            priceId: priceId,
            subscription: result,
          };
        })
        // Some payment methods require a customer to be on session
        // to complete the payment process. Check the status of the
        // payment intent to handle these actions.
        .then(handlePaymentThatRequiresCustomerAction)
        // If attaching this card to a Customer object succeeds,
        // but attempts to charge the customer fail, you
        // get a requires_payment_method error.
        .then(handleRequiresPaymentMethod)
        // No more actions required. Provision your service for the user.
        .then(onSubscriptionComplete)
        .catch((error) => {
          // An error has happened. Display the failure to the user here.
          // We utilize the HTML element we created.
          showCardError(error);
        })
    );
  }

  function handleRequiresPaymentMethod({
    subscription,
    paymentMethodId,
    priceId,
  }) {
    if (subscription.status === 'active') {
      // subscription is active, no customer actions required.
      return { subscription, priceId, paymentMethodId };
    } else if (
      subscription.latest_invoice.payment_intent.status ===
      'requires_payment_method'
    ) {
      // Using localStorage to manage the state of the retry here,
      // feel free to replace with what you prefer.
      // Store the latest invoice ID and status.
      localStorage.setItem('latestInvoiceId', subscription.latest_invoice.id);
      localStorage.setItem(
        'latestInvoicePaymentIntentStatus',
        subscription.latest_invoice.payment_intent.status
      );
      throw { error: { message: 'Your card was declined.' } };
    } else {
      return { subscription, priceId, paymentMethodId };
    }
  }

  function retryInvoiceWithNewPaymentMethod({
    userId,
    customerId,
    paymentMethodId,
    invoiceId,
    priceId
  }) {
    return (
      fetch(process.env.REACT_APP_PROVIDER_API_URL + '/account/retry-invoice/' + userId, {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          paymentMethodId: paymentMethodId,
          invoiceId: invoiceId,
        }),
      })
        .then((response) => {
          return response.json();
        })
        // If the card is declined, display an error to the user.
        .then((result) => {
          if (result.error) {
            // The card had an error when trying to attach it to a customer.
            throw result;
          }
          return result;
        })
        // Normalize the result to contain the object returned by Stripe.
        // Add the additional details we need.
        .then((result) => {
          return {
            // Use the Stripe 'object' property on the
            // returned result to understand what object is returned.
            invoice: result,
            paymentMethodId: paymentMethodId,
            priceId: priceId,
            isRetry: true,
          };
        })
        // Some payment methods require a customer to be on session
        // to complete the payment process. Check the status of the
        // payment intent to handle these actions.
        .then(handlePaymentThatRequiresCustomerAction)
        // No more actions required. Provision your service for the user.
        .then(onSubscriptionComplete)
        .catch((error) => {
          // An error has happened. Display the failure to the user here.
          // We utilize the HTML element we created.
          displayError(error);
        })
    );
  }
  
  export default {
    initiateCheckout,
    createSubscription,
    retryInvoiceWithNewPaymentMethod,
    handleRequiresPaymentMethod
  }