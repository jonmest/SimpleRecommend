import React from 'react';
import './App.scss';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Login from './components/pages/auth/Login'
import Navbar from './components/layouts/Navbar'
import SignUpWizard from './components/pages/SignUp/SignUpWizard'
import VerifyEmail from './components/pages/SignUp/VerifyEmail'

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
function App() {
  return (
    <CookiesProvider>
      <GlobalState>

        <Router>
          <Navbar />
          <AlertBar />
          <Switch>

            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={SignUpWizard} />
            <Route path='/verify-email-token/:token' component={VerifyEmail} />

            <ProtectedRoute exact path='/success' component={SuccessComponent} />
            <ProtectedRoute path='/account' component={Account} />
          </Switch>
        </Router>
      </GlobalState>
    </CookiesProvider>
  );
}

export default App;
