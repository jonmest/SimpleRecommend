import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import { useCookies } from 'react-cookie'
import RecommendSettings from './RecommendSettings'
import Dashboard from './Dashboard'

const selections = {
    DASHBOARD: "DASHBOARD",
    REC_SETTINGS: "REC_SETTINGS",
    ACCOUNT_SETTINGS: "ACCOUNT_SETTINGS"
}

const Account = ({state}) => {
    const globalState = useContext(GlobalContext)
 
    const [selected, setSelected] = useState(selections.DASHBOARD)
    
    const handleClick = e => {
        setSelected(e.target.id)
    }

    const getCurrentView = () => {
        switch (selected) {
            case selections.DASHBOARD:
                return <Dashboard/>
            case selections.REC_SETTINGS:
                return <RecommendSettings/>
        }
    }

    return (
      <Fragment>
          <section class="section">
          <div class="container">
        <div class="columns">
            <div class="column is-one-quarter is-secondary">
            <p class="menu-label">
                General
            </p>
            <ul class="menu-list">
                <li><a class={
                    (selected == selections.DASHBOARD) ?
                    "active" : "" } id={selections.DASHBOARD} onClick={handleClick} >Dashboard</a></li>
                <li><a class={
                    (selected == selections.REC_SETTINGS) ?
                    "active" : "" } id={selections.REC_SETTINGS} onClick={handleClick} >Recommendation Settings</a></li>
                <li><a class={
                    (selected == selections.ACCOUNT_SETTINGS) ?
                    "active" : "" } id={selections.ACCOUNT_SETTINGS} onClick={handleClick} >Account</a></li>
            </ul>
            </div>
            <div class="column">
                {
                    getCurrentView()
                }
            </div>
        </div>
        </div>
        </section>
      </Fragment>
    )
  }
  
  export default Account