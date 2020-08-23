import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51HIgVeCAPJL19xqxtQVRx9EESZ5UtuIivpjweKe2xbNtNysCzHwyWN9nHkzztiM5Z9VJQrhmFveSzWM2SwPbjUVZ00bbeKbX6J');

const ConfirmOrder = () => {
    const globalState = useContext(GlobalContext)
    const state = globalState.signupProcess
    const [err, setErr] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { sessionId } = state
        // When the customer clicks on the button, redirect them to Checkout.
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId,
        });
      }
    
    return (
      <Fragment>
      <div class="container">
            <section class="section">
             <div class="columns">
              <div class="column"></div>
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
                <div class="field">
                  <div className="control">
                    <button onClick={handleSubmit} className="button is-danger is-fullwidth">Checkout now</button>
                  </div>
                </div>
              </div>
              <div class="column"></div>
            </div>
        
          </section>
          </div>     
        </Fragment>
    )
}

export default ConfirmOrder