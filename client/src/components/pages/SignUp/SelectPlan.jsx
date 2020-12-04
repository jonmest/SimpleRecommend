import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import Cookies from 'js-cookie'

console.log(Cookies)
const planToPriceID = {
  "value": "price_1HIgYpCAPJL19xqxpRDwnvab",
  "heavy": "price_1HJ49yCAPJL19xqxrFJZjq40"
}

const SelectPlan = () => {
  const globalState = useContext(GlobalContext)
  const { plan } = globalState.signupProcess

  const selectHeavy = () => {
    globalState.setSignupProcess({
      ...globalState.signupProcess,
      plan: "heavy",
      priceId: planToPriceID["heavy"]
    })
  }
  const selectValue = () => {
    globalState.setSignupProcess({
      ...globalState.signupProcess,
      plan: "value",
      priceId: planToPriceID["value"]
    })
  }

  useEffect(() => {
    if (plan === "") {
      selectHeavy()
    }
  }, [])

  const submit = () => {

    fetch(process.env.REACT_APP_PROVIDER_API_URL + '/account/session', {
      method: 'post', mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cookies.get('token')
      },
      body: JSON.stringify({
        priceId: globalState.signupProcess.priceId,
        email: globalState.signupProcess.email
      })
    })
      .then(res => res.json())
      .then(data => data.data)
      .then(data => globalState.setSignupProcess({
        ...globalState.signupProcess,
        sessionId: data.id,
        currentStep: 3
      }))
      .catch(e => {
        console.log("[SESSION CREATION]: ", e)
      })
  }

  return (
    <Fragment>
      <div class="container">
        <section class="section">
          <p className="title is-1">
            Select A Plan
              </p>
          <p>
            {
              plan == "heavy" ?
                "Heavy Plan Selected" :
                "Value Plan Selected"
            }
          </p>
          <button class="button is-info is-fullwidth" onClick={submit}>Next →</button>
        </section>
        <div class="columns">
          <div class="column">
            <div class="card">
              <div class="card-content">
                <div class="has-text-centered">

                  <span className="subtitle">Heavy Plan<br /></span>
                  <span className="title">$219 <small>/ mo</small></span>
                </div>
                <hr />
                <ul className="list-unstyled mt-3 mb-4">
                  <li>First <b>15 days free</b></li>
                  <li>Track preferences of <b>110,000 unique users</b></li>
                  <li>Free access to API and Dashboard</li>
                  <li>Priority email support</li>
                </ul>
                <br />
                {
                  plan == "heavy" ?
                    <button onClick={selectHeavy} class="button is-danger">Selected</button> :
                    <button onClick={selectHeavy} class="button is-danger is-outlined">Select Now</button>
                }
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-content">
                <div class="has-text-centered">

                  <span className="subtitle">Value Plan<br /></span>
                  <span className="title">$49 <small>/ mo</small></span>
                </div>
                <hr />
                <ul className="list-unstyled mt-3 mb-4">
                  <li>First <b>15 days free</b></li>
                  <li>Track preferences of <b>20,000 unique users</b></li>
                  <li>Free access to API and Dashboard</li>
                  <li>Priority email support</li>
                </ul>
                <br />
                {
                  plan == "value" ?
                    <button onClick={selectValue} class="button is-danger">Selected</button> :
                    <button onClick={selectValue} class="button is-danger is-outlined">Select Now</button>
                }
              </div>
            </div>
          </div>
        </div>

      </div>
    </Fragment>
  )
}

export default SelectPlan