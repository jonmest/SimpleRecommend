import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import { useCookies } from 'react-cookie'
import AccountSettings from './AccountSettings'

const Stats = ({state}) => {
    const globalState = useContext(GlobalContext)
   

    return (
      <Fragment>
          <section class="section">
          <div class="container">
          <div class="columns">
            <div class="column">
                <div class="card has-background-light">
                <div class="card-content">
                    <p class="title">
                    120,000
                    </p>
                    <p class="subtitle">
                    Users Tracked this month
                    </p>
                </div>
                </div>
            </div>
            <div class="column">
            <div class="card has-background-info">
                <div class="card-content">
                    <p class="title">
                    49,000
                    </p>
                    <p class="subtitle">
                    Recommendations made
                    </p>
                </div>
                </div>
            </div>

            <div class="column">
            <div class="card has-background-success">
                <div class="card-content">
                    <p class="title">
                    149%
                    </p>
                    <p class="subtitle">
                    As effective as naive baseline
                    </p>
                </div>
                </div>
            </div>
        </div>

        </div>
        </section>
      </Fragment>
    )
  }
  
  export default Stats