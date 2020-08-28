import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import { useCookies } from 'react-cookie'

const Register = ({ state }) => {
  const globalState = useContext(GlobalContext)
  const { username, email, password1, password2 } = globalState.signupProcess
  const [cookies, setCookie, removeCookie] = useCookies(['token'])
  const [error, setError] = useState("")

  useEffect(() => {
    globalState.setSignupProcess({
      ...globalState.signupProcess,
      currentStep: 1
    })
  }, [])

  const handleInput = e => {
    const tmp = globalState.signupProcess
    tmp[e.target.id] = e.target.value
    globalState.setSignupProcess(tmp)
  }

  const submit = () => {
    if (password1.length != "" &&
      password1 == password2 &&
      username.length != "" &&
      email.length != "") {

      fetch(process.env.REACT_APP_PROVIDER_API_URL + '/account', {
        method: 'post', mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password: password1,
          email
        })
      })
        .then(data => {
          if (data.status == 500) {
            return data.json()
              .then(data => {
                throw new Error(data.data)
              })
          }
          return data
        })
        .then(data => data.json())
        .then(data => data.data)
        .then(data => {
          const id = data.id
          const token = data.token
          globalState.setClient({
            id, email, username
          })
          setCookie('token', token)
          return token
        })
        .then(token => {
          fetch(process.env.REACT_APP_PROVIDER_API_URL + '/verify-email', {
            method: 'post', mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          })
            .then(data => data.json())
            .then(data => console.log(data))
        })
        .then(() => {
          globalState.setSignupProcess({
            ...globalState.signupProcess,
            currentStep: 2
          })
        })
        .catch(e => {
          setError(e.message)
          console.log(e)
        })


    }
  }

  return (
    <Fragment>


      <div class="columns">
        <div class="column"></div>
        <div class="column is-half">
          <span className="title">Register</span>
          <p>Create your account. It's free and only takes a minute.</p>
          <hr />
          <div class="field">
            <label class="label">Username</label>
            <div class="control">
              <input class="input" id="username" value={username} onChange={handleInput} type="text" placeholder="Username" required="required" />
            </div>
          </div>
          <div class="field">
            <div className="control">
              <label class="label">Email</label>
              <input type="email" id="email" class="input" value={email} onChange={handleInput} name="email" placeholder="Email" required="required" />
            </div>
          </div>
          <div class="field">
            <div className="control">
              <label class="label">Password</label>
              <input type="password" id="password1" className="input" value={password1} onChange={handleInput} name="password1" placeholder="Password" required="required" />
            </div>
          </div>
          <div class="field">
            <div className="control">
              <label class="label">Confirm password</label>
              <input type="password" id="password2" className="input" value={password2} onChange={handleInput} name="password2" placeholder="Confirm password" required="required" />
            </div>
          </div>
          <div class="field">
            <div className="control">
              <button class="button is-danger" onClick={submit}>Register Now</button>

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

export default Register