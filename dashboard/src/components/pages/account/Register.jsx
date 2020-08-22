import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'

const Register = ({state, callback, parentStateModifier}) => {
    /*
    * State
    */
    const globalState = useContext(GlobalContext)

    useEffect(() => {
      globalState.setSignupProcess({
        currentStep: 1
      })
    }, [])
    
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
  
    const changeEmail = (event) => setEmail(event.target.value)
    const changeUsername = (event) => setUsername(event.target.value)
    const changePassword1 = (event) => setPassword1(event.target.value)
    const changePassword2 = (event) => setPassword2(event.target.value)
    
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
        <div class="container mt-5">

<div className="signup-form">
		<h2>Register</h2>
		<p className="hint-text">Create your account. It's free and only takes a minute.</p>
        <div className="form-group">
			<div className="row">
				<div className="col"><input type="text" onChange={changeUsername} className="form-control" name="first_name" placeholder="Username" required="required"/></div>
			</div>        	
        </div>
        <div className="form-group">
        	<input type="email" className="form-control" onChange={changeEmail} name="email" placeholder="Email" required="required"/>
        </div>
		<div className="form-group">
            <input type="password" className="form-control" onChange={changePassword1} name="password" placeholder="Password" required="required"/>
        </div>
		<div className="form-group">
            <input type="password" className="form-control" onChange={changePassword2} name="confirm_password" placeholder="Confirm Password" required="required"/>
        </div>        
        <div className="form-group">
			<label className="form-check-label"><input type="checkbox" required="required"/> I accept the <a href="#">Terms of Use</a> &amp; <a href="#">Privacy Policy</a></label>
		</div>
		<div className="form-group">
            <button type="submit" onClick={submit} className="btn btn-success btn-lg btn-block">Register Now</button>
        </div>
	<div className="text-center">Already have an account? <a href="#">Sign in</a></div>
</div>
</div>
      </Fragment>
    )
  }      
  
  export default Register