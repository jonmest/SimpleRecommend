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
import Loader from 'react-loader-spinner'


const SignUpWizard = () => {
  const globalState = useContext(GlobalContext)
  const { setSignupProcess } = globalState

  useEffect(() => {
    globalState.setSignupProcess({
      currentStep: 1,
      username: "",
      email: "",
      password1: "",
      password2: "",
      plan: "",
      priceId: "",
      sessionId: ""
    })
  }, [])


  const getStep = () => {
    switch (globalState.signupProcess.currentStep) {
      case 1:
        return <Register />
      case 2:
        return <SelectPlan />
      case 3:
        return <ConfirmOrder />
      default:
        return null
    }
  }

  const goBack = () => {
    const previousStep = globalState.signupProcess.currentStep - 1
    setSignupProcess({ ...globalState.signupProcess, currentStep: previousStep })
  }

  const backButton = () => {
    if (globalState.signupProcess.currentStep > 1) {
      return <button onClick={goBack} className="button">← Previous</button>
    }
  }

  return (
    !globalState.signupProcess ?
      <Loader
        type="Puff"
        color="#00BFFF"
        height={100}
        width={100} //3 secs   
      /> : <section class="section">
        <div class="container">
          {backButton()}
          <br />
          {getStep()}
        </div>
      </section>
  )
}

export default SignUpWizard