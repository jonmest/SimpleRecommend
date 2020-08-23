import React from 'react';
import './App.scss';
import Login from './components/pages/auth/Login'
import Navbar from './components/layouts/Navbar'
import SignUpWizard from './components/pages/SignUp/SignUpWizard'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,

} from "react-router-dom"
import { CookiesProvider } from 'react-cookie';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import GlobalState from './context/global/GlobalState'
import SuccessComponent from './components/pages/SignUp/SuccessComponent'

const stripePromise = loadStripe("pk_test_51HIgVeCAPJL19xqxtQVRx9EESZ5UtuIivpjweKe2xbNtNysCzHwyWN9nHkzztiM5Z9VJQrhmFveSzWM2SwPbjUVZ00bbeKbX6J");

function App() {
  return (
    <CookiesProvider>
    <GlobalState>
      <Elements stripe={stripePromise}>

    <Router>
        <Navbar/>

          <Switch>
            
            <Route exact path='/login' component={Login}/>
            <Route exact path='/register' component={SignUpWizard}/>
            <Route exact path='/success' component={SuccessComponent}/>

          </Switch>
        </Router>
        </Elements>
    </GlobalState>
    </CookiesProvider>
  );
}

export default App;
