import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'

const SelectPlan = () => {
    const globalState = useContext(GlobalContext)
    const [selected, setSelected] = useState("heavy")
    const selectHeavy = () => {
        setSelected("heavy")
    }
    const selectValue = () => {
        setSelected("value")
    }

    const submit = () => {
      globalState.setSignupProcess({
        currentStep: 3,
        plan: selected
      })
    }

    return (
      <Fragment>
          <div class="container mt-5">
              <h1 className="text-centered">
                  Select A Plan
              </h1>
              <p>
                  {
                      selected == "heavy" ?
                      "Heavy Plan Selected" :
                      "Value Plan Selected"
                  }
              </p>
              <button type="button" className="btn btn-lg btn-block btn-danger mb-5" onClick={submit}>Next →</button>

<div className="card-deck mb-2 text-center">

    <div className={
        selected == "heavy" ?
        "card mb-4 box-shadow border border-primary" :
        "card mb-4 box-shadow"}>
      <div className="card-header">
        <h4 className="my-0 font-weight-normal">Heavy Plan</h4>
      </div>
      <div className="card-body">
        <h1 className="card-title pricing-card-title">$219 <small className="text-muted">/ mo</small></h1>
        <ul className="list-unstyled mt-3 mb-4">
          <li>First <b>15 days free</b></li>
          <li>Track preferences of <b>110,000 unique users</b></li>
          <li>Free access to API and Dashboard</li>
          <li>Priority email support</li>
        </ul>
        {
          selected == "heavy" ?
          <button type="button"  onClick={selectHeavy} className="btn btn-lg btn-block btn-primary">Selected</button> :
          <button type="button"  onClick={selectHeavy} className="btn btn-lg btn-block btn-outline-primary">Select Now</button>
        }
        
      </div>
    </div>
    <div className={
        selected == "value" ?
        "card mb-4 box-shadow border border-primary" :
        "card mb-4 box-shadow"}>
      <div className="card-header">
        <h4 className="my-0 font-weight-normal">Value Plan</h4>
      </div>
      <div className="card-body">
        <h1 className="card-title pricing-card-title"><small className="text-muted">$49 / mo</small></h1>
        <ul className="list-unstyled mt-3 mb-4">
            <li>First <b>15 days free</b></li>
            <li>Track preferences of <b>20,000 unique users</b></li>
            <li>Free access to API and Dashboard</li>
            <li><br/></li>
        </ul>
        {
          selected == "value" ?
          <button type="button"  onClick={selectValue} className="btn btn-lg btn-block btn-primary">Selected</button> :
          <button type="button"  onClick={selectValue} className="btn btn-lg btn-block btn-outline-primary">Select Now</button>
        }
      </div>
    </div>
  </div>
  </div>
      </Fragment>
    )
  }      
  
  export default SelectPlan