import React, { Fragment, useState, useEffect, useContext } from 'react'

const Login = props => {

    /*
    * State
    */
    // const globalState = useContext(GlobalContext)
    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
  
    
    
    return (
      <Fragment>
        <div class="container mt-5">

<div className="signup-form">
    <form>
		<h2>Log in</h2>
		<p className="hint-text">Have an account? Sign in now!</p>
        <div className="form-group">
			<div className="row">
				<div className="col"><input type="text" className="form-control" name="first_name" placeholder="Username or email" required="required"/></div>
			</div>        	
        </div>
		<div className="form-group">
            <input type="password" className="form-control" name="password" placeholder="Password" required="required"/>
        </div>
 
		<div className="form-group">
            <button type="submit" className="btn btn-success btn-lg btn-block">Log In</button>
        </div>
    </form>
</div>
</div>
      </Fragment>
    )
  }      
  
  export default Login