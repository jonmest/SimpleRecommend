import React, { Fragment, useState, useEffect, useContext, } from 'react'
import GlobalContext from './../../../context/global/GlobalContext'
import Cookies from 'js-cookie'
import { useHistory } from "react-router-dom";
import { useAlert } from 'react-alert'

const Login = props => {
  const history = useHistory();

  /*
  * State
  */
  // const globalState = useContext(GlobalContext)
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const globalState = useContext(GlobalContext)
  const alert = useAlert()

  const handleSubmit = e => {
    e.preventDefault()
    setError('')
    fetch(process.env.REACT_APP_PROVIDER_API_URL + '/login', {
      method: 'post', mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify({
        identity, password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status == "success" && data.token) {
          globalState.setClient(data.user)
          globalState.setIsAuthenticated(true)
          Cookies.set('token', data.token)
          history.push('/account')
          console.log("Logged in.")
        } else throw new Error()
      })
      .catch(e => alert.show('Something went wrong.', {type: 'error'}))
  }

  return (
    <Fragment>
      <div class="columns">
        <div class="column"></div>
        <div class="column is-half">
          <span className="title">Log in</span>
          <hr />
          <div class="field">
            <label class="label">Username or email</label>
            <div class="control">
              <input class="input"onChange={e => {
                  setIdentity(e.target.value)
                }} placeholder="Username or email" type="text" placeholder="Username" required="required" />
            </div>
          </div>
          <div class="field">
            <div className="control">
              <label class="label">Password</label>
              <input type="password" id="password1" className="input" onChange={e => {
                setPassword(e.target.value)
              }} name="password" placeholder="Password"required="required" />
            </div>
          </div>
          
          <div class="field">
            <div className="control">
              <button class="button is-danger" onClick={handleSubmit} >Login Now</button>

            </div>
          </div>
          <div class="field">
            <div className="control">
              {
                error ?
                  <p class="has-text-danger">{error}</p> :
                  null
              }
            </div>
          </div>
        </div>
        <div class="column"></div>

      </div>
      
    </Fragment>
  )
}

export default Login