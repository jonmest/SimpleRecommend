import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import CardSection from './CardSection'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const ConfirmOrder = () => {
    const globalState = useContext(GlobalContext)
    const state = globalState.signupProcess
    const stripe = useStripe();
    const elements = useElements();
    const {priceId} = state.priceId


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
       fetch('/account', {
          method: 'post',
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
        }).then(customer => createSubscription(customer, priceId))


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

export default ConfirmOrder