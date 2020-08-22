import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import CardSection from './CardSection'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';


const ConfirmOrder = () => {
    const globalState = useContext(GlobalContext)
    const state = globalState.signupProcess
    const stripe = useStripe();
    const elements = useElements();
    const priceId = state.priceId

    const onSubscriptionComplete = () => {
      console.log("Subscription complete.")
    }

    const showCardError = () => {
      console.log("Card error")
    }

    const createSubscription = ({ userId, customerId, paymentMethodId, priceId, token}) => {
      return (
        fetch(process.env.REACT_APP_PROVIDER_API_URL + '/account/subscribe/' + userId, {
          method: 'post',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-type': 'application/json',
          },
          mode: 'cors',
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
          // .then(handlePaymentThatRequiresCustomerAction)
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

      const retryInvoiceWithNewPaymentMethod = ({
        userId,
        customerId,
        paymentMethodId,
        invoiceId,
        priceId,
        token
        }) => {
        return (
          fetch(process.env.REACT_APP_PROVIDER_API_URL + '/account/retry-invoice/' + userId, {
            method: 'post',
            mode: 'cors',
            headers: {
              'Content-type': 'application/json',
              'Authorization': 'Bearer ' + token,
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
            //.then(handlePaymentThatRequiresCustomerAction)
            // No more actions required. Provision your service for the user.
            .then(onSubscriptionComplete)
            .catch((error) => {
              // An error has happened. Display the failure to the user here.
              // We utilize the HTML element we created.
              console.log(error);
            })
        );
        }


    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();
        if (!stripe || !elements) {
          // Stripe.js has not yet loaded.
          // Make sure to disable form submission until Stripe.js has loaded.
          return;
        }

        /*
        Create an account and Stripe customer.
        */
       fetch(process.env.REACT_APP_PROVIDER_API_URL + '/account', {
          method: 'post',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: state.username,
            password: state.password1,
            email: state.email
          }),
        }).then((response) => {
          return response.json();
        }).then(data => data.data).then(async data => {
          const userId = data.id
          const customerId = data.stripe_customer.id
          const token = data.token
          const cardElement = elements.getElement(CardElement);

          console.log("DATA:")
          console.log(data)

          // If a previous payment was attempted, get the latest invoice
          const latestInvoicePaymentIntentStatus = localStorage.getItem(
            'latestInvoicePaymentIntentStatus'
          );

          const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
          })

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
                token
              });
            } else {
              // Create the subscription
              debugger
              createSubscription({ userId, customerId, paymentMethodId, priceId, token });
              debugger
            }
          }
        })


      }
    
    return (
      <Fragment>

      <div class="container">
            <section class="section">
        
            <div class="columns">
  <div class="column">
  </div>
  <div class="column is-half">
  <h1>Order Checkout:</h1>
        <table class="table is-fullwidth">
    <thead>
        <tr>
        <th scope="col"> </th>
        <th scope="col">You Chose:</th>
        </tr>
    </thead>
    <tbody>
        <tr>
        <th scope="row">Username</th>
        <td>{state.username}</td>
        </tr>
        <tr>
        <th scope="row">Email</th>
        <td>{state.email}</td>
        </tr>
        <tr>
        <th scope="row">Plan</th>
        <td>{state.plan.charAt(0).toUpperCase() + state.plan.slice(1)}, renewed montly</td>
        </tr>
    </tbody>
    </table>
        <CardSection />
        <div class="field">
            <div className="control">
      <button onClick={handleSubmit} className="button is-danger is-fullwidth" disabled={!stripe}>Confirm order</button>
      </div>
      </div>  </div>
  <div class="column">
  </div>
</div>
        
      </section>

        </div>

        
        </Fragment>
    )
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


export default ConfirmOrder