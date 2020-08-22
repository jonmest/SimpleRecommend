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
  const { setSignupProcess } = globalState

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

const goBack = () => {
  const previousStep = currentStep - 1
  setSignupProcess({...globalState.signupProcess, currentStep: previousStep})
}

const backButton = () => {
  if (currentStep > 1) {
    return <button onClick={goBack} className="button">← Previous</button>
  }
}

  return (
    <section class = "section">
    <div class = "container">
    {backButton()}
    <br/>
      {getStep()}
    </div>
    </section>
  )
}

export default SignUpWizard