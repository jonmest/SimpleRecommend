import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'

const Register = ({state, callback, parentStateModifier}) => {
    /*
    * State
    */
    const globalState = useContext(GlobalContext)
    const { username, email, password1, password2 } = globalState.signupProcess

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
    
    // const [email, setEmail] = useState('')
    // const [username, setUsername] = useState('')
    // const [password1, setPassword1] = useState('')
    // const [password2, setPassword2] = useState('')
  
    // const changeEmail = (event) => setEmail(event.target.value)
    // const changeUsername = (event) => setUsername(event.target.value)
    // const changePassword1 = (event) => setPassword1(event.target.value)
    // const changePassword2 = (event) => setPassword2(event.target.value)
    
    const submit = () => {
      if (password1.length != "" &&
          password1 == password2 &&
          username.length != "" &&
          email.length != "") {
        globalState.setSignupProcess({
          currentStep: 2,
          password: password1,
          username,
          email
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
    <hr/>
              <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input class="input" id="username" value={username} onChange={handleInput} type="text" placeholder="Username" required="required"/>
              </div>
            </div>
            <div class="field">
            <div className="control">
              <label class="label">Email</label>
              <input type="email" id="email" class="input" value={email} onChange={handleInput} name="email" placeholder="Email" required="required"/>
            </div>
            </div>
            <div class="field">
            <div className="control">
              <label class="label">Password</label>
              <input type="password" id="password1" className="input" value={password1} onChange={handleInput} name="password1" placeholder="Password" required="required"/>
            </div>
            </div>
            <div class="field">
            <div className="control">
              <label class="label">Confirm password</label>
              <input type="password" id="password2" className="input" value={password2} onChange={handleInput} name="password2" placeholder="Confirm password" required="required"/>
            </div>
            </div>
            <div class="field">
            <div className="control">
              <button class="button is-danger" onClick={submit}>Register Now</button>
            </div>
            </div>
      </div>
      <div class="column"></div>

    </div>
    
      </Fragment>
    )
  }      
  
  export default Register