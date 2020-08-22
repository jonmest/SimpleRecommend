import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import Register from './Register'
import SelectPlan from './SelectPlan'
import ConfirmOrder from './ConfirmOrder'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch
} from "react-router-dom"

const SignUpWizard = () => {
  const globalState = useContext(GlobalContext)
  const { currentStep } = globalState.signupProcess

  const getStep = () => {
    switch (currentStep){
      case 1:
        return <Register/>
      case 2:
        return <SelectPlan/>
      case 3:
        return <ConfirmOrder/>
      default:
        return null
    }
  }

  return (
  <div class="container">
    {getStep()}
  </div>
  )
}

export default SignUpWizard