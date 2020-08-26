import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import Cookies from 'js-cookie'

const RecommendSettings = ({state}) => {   
  const globalState = useContext(GlobalContext)
  const { domain, max_rating, min_rating } = globalState.client

  const handleChange = e => {
    const client = globalState.client
    if (e.target.type === "number") {
      client[e.target.name] = parseFloat(e.target.value)
    } else {
      client[e.target.name] = e.target.value
    }
    globalState.setClient(client)
  }

  const handleSubmit = e => {
    e.preventDefault()
    fetch(process.env.REACT_APP_PROVIDER_API_URL + '/account', {
      method: 'PATCH', mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cookies.get('token')
      },
      body: JSON.stringify({
        max_rating, min_rating, domain
      })})
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
  }
    return (
      <Fragment>
        <section class="section">
          <div class="container">
          <form class="form-horizontal" onSubmit={handleSubmit} >
        <fieldset>

        <legend>Settings for recommendation generation</legend>


        <div class="field">
        <label class="label" for="textinput-0">Origin Domain</label>
        <div class="control">
            <input onChange={handleChange} id="textinput-0" name="domain" value={domain} type="text" placeholder="YourCompanySite.com" class="input " required/>
            <p class="help">Enter the domain for the site you want to track. IE yourcompany.com. This is required to prevent others from tampering with your user data.</p>
        </div>
        </div>


        <div class="field">
        <label class="label" for="textinput-0">Minimum rating</label>
        <div class="control">
            <input onChange={handleChange} id="textinput-0" name="min_rating" value={min_rating} type="number" placeholder="1" class="input " required/>
        </div>

        <label class="label" for="textinput-0">Maximum rating</label>
        <div class="control">
            <input onChange={handleChange} id="textinput-0" name="max_rating" type="number" value={max_rating} placeholder="5" class="input " required/>
        </div>
        </div>

        <div class="field">
        <label class="label" for="singlebutton-0"></label>
        <div class="control">
            <button id="singlebutton-0" name="singlebutton-0" class="button is-primary">Save Recommendation Settings</button>
        </div>
        </div>

        </fieldset>
        </form>
          </div>
        </section>
      </Fragment>
    )
  }
  
  export default RecommendSettings