import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import { useCookies } from 'react-cookie'
import AccountSettings from './AccountSettings'
import Stats from './Stats'

const selections = {
    DASHBOARD: "DASHBOARD",
    REC_SETTINGS: "REC_SETTINGS",
    ACCOUNT_SETTINGS: "ACCOUNT_SETTINGS"
}

const Dashboard = ({state}) => {
    const globalState = useContext(GlobalContext)
 
    const [selected, setSelected] = useState(selections.DASHBOARD)
    
    const handleClick = e => {
        setSelected(e.target.id)
    }

    const getCurrentView = () => {
        switch (selected) {
            case selections.DASHBOARD:
                return <Stats/>
            case selections.REC_SETTINGS:
                return <AccountSettings/>
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
                <li><a id={selections.DASHBOARD} onClick={handleClick} >Dashboard</a></li>
                <li><a id={selections.REC_SETTINGS} onClick={handleClick} >Recommendation Settings</a></li>
                <li><a id={selections.ACCOUNT_SETTINGS} onClick={handleClick} >Account</a></li>
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
  
  export default Dashboard