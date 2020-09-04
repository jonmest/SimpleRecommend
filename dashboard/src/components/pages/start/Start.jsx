import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import { useCookies } from 'react-cookie'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import { ResponsiveContainer, CartesianGrid, YAxis, Tooltip, Legend, XAxis, LineChart, Line } from 'recharts';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
  
  } from "react-router-dom"

const Start = ({ state }) => {
    const globalState = useContext(GlobalContext)
    const { isAuthenticated } = globalState.isAuthenticated

    return (
        <Fragment>

        <section class="hero is-medium is-fullheight">
        <div class="hero-body">
            <div class="container">
            <h1 class="title">
                Improve Your Profits With Tailored Customer Recommendations
            </h1>
            <h2 class="subtitle">
                The SimpleRecommend AI learns the preferences of your users and generates customized recommendations.
                 <strong>  Use it to increase online sales, sign-ups and time spent on site.</strong>
            </h2>
            <div class="buttons">
                {
                    (!Cookies.get('token')) ? <Fragment>
                        <Link to="/register"><button class="button is-danger">Sign Up Now</button> </Link>
                        <Link to="/login" style={{marginLeft: "10px"}}><button class="button">Login</button></Link>
                    </Fragment> : <Fragment>
                    <Link to="/account"><button class="button is-danger">Go to your account</button> </Link>
                    </Fragment>
                }
                
            </div>

            </div>
        </div>
        </section>

        </Fragment>

    )
}

export default Start