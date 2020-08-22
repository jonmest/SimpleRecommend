import React from 'react';
import './App.css';
import Login from './components/pages/auth/Login'
import Navbar from './components/layouts/Navbar'
import SignUpWizard from './components/pages/account/SignUpWizard'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,

} from "react-router-dom"

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import GlobalState from './context/global/GlobalState'

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

function App() {
  return (
    <GlobalState>
      <Elements stripe={stripePromise}>

    <Router>
        <Navbar/>

          <Switch>
            
            <Route exact path='/login' component={Login}/>
            <Route exact path='/register' component={SignUpWizard}/>


          </Switch>
        </Router>
        </Elements>
    </GlobalState>
  );
}

export default App;
