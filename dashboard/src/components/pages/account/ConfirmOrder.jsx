import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import CardSection from './CardSection'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const ConfirmOrder = () => {
    const globalState = useContext(GlobalContext)
    const state = globalState.signupProcess
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();
        if (!stripe || !elements) {
          // Stripe.js has not yet loaded.
          // Make sure to disable form submission until Stripe.js has loaded.
          return;
        }

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
              customerId,
              paymentMethodId,
              invoiceId,
              priceId,
            });
          } else {
            // Create the subscription
            createSubscription({ customerId, paymentMethodId, priceId });
          }
        }
      }
    
    return (
        <Fragment>
        <div className="container">
        <h1>Order Checkout:</h1>
        <table class="table">
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
    <form onSubmit={handleSubmit}>
      <CardSection />
      <button disabled={!stripe}>Confirm order</button>
    </form>
        </div>
        </Fragment>
    )
}      

export default ConfirmOrder