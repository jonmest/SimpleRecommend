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
import ProtectedRoute from './components/ProtectedRoute'
import AccountSettings from './components/pages/account/AccountSettings'
import Dashboard from './components/pages/account/Dashboard'
function App() {
  return (
    <CookiesProvider>
    <GlobalState>

    <Router>
        <Navbar/>

          <Switch>
            
            <Route exact path='/login' component={Login}/>
            <Route exact path='/register' component={SignUpWizard}/>
            <Route exact path='/success' component={SuccessComponent}/>
            <ProtectedRoute path='/account' component={AccountSettings}/>
            <Route exact path='/settings' component={Dashboard}/>
          </Switch>
        </Router>
    </GlobalState>
    </CookiesProvider>
  );
}

export default App;
