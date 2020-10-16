import React from 'react';
import './App.scss';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Login from './components/pages/auth/Login'
import Navbar from './components/layouts/Navbar'
import SignUpWizard from './components/pages/SignUp/SignUpWizard'
import VerifyEmail from './components/pages/SignUp/VerifyEmail'
import Start from './components/pages/start/Start'
import Footer from './components/layouts/Footer'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,

} from "react-router-dom"
import { CookiesProvider } from 'react-cookie';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import GlobalState from './context/global/GlobalState'
import SuccessComponent from './components/pages/SignUp/SuccessComponent'
import ProtectedRoute from './components/ProtectedRoute'
import Account from './components/pages/account/Account'
import AlertBar from './components/layouts/AlertBar';

import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

function App() {
  return (
    <CookiesProvider>
      <GlobalState>
      <AlertProvider template={AlertTemplate} {...options}>

        <Router>
          <Navbar />
          <AlertBar />
          <Switch>
            <Route exact path='/' component={Start}/>
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={SignUpWizard} />
            <Route path='/verify-email-token/:token' component={VerifyEmail} />

            <ProtectedRoute exact path='/success' component={SuccessComponent} />
            <ProtectedRoute path='/account' component={Account} />
          </Switch>
        </Router>
        <Footer/>
        </AlertProvider>
      </GlobalState>
    </CookiesProvider>
  );
}

export default App;
