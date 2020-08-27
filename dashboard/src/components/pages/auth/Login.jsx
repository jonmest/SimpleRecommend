import React, { Fragment, useState, useEffect, useContext, } from 'react'
import GlobalContext from './../../../context/global/GlobalContext'
import Cookies from 'js-cookie'
import { useHistory } from "react-router-dom";

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
        }
      })
      .catch(e => setError(e.message))
  }

  return (
    <Fragment>
      <div class="container mt-5">

        <div className="signup-form">
          <form onSubmit={handleSubmit}>
            <h2>Log in</h2>
            <p className="hint-text">Have an account? Sign in now!</p>
            <div className="form-group">
              <div className="row">
                <div className="col"><input type="text" className="form-control" name="identity" onChange={e => {
                  setIdentity(e.target.value)
                }} placeholder="Username or email" required="required" /></div>
              </div>
            </div>
            <div className="form-group">
              <input type="password" className="form-control" onChange={e => {
                setPassword(e.target.value)
              }} name="password" placeholder="Password" required="required" />
            </div>

            <div className="form-group">
              {
                error ?
                  <p> {error} </p> :
                  null
              }
              <button type="submit" className="btn btn-success btn-lg btn-block">Log In</button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  )
}

export default Login