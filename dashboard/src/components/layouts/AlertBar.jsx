import React, { Fragment, useState, useEffect, useContext } from 'react'
import Alert from './Alert'
import GlobalContext from '../../context/global/GlobalContext'

const AlertBar = () => {
    const globalState = useContext(GlobalContext)
    const { pushAlert } = globalState

    useEffect(() => {
        if (globalState.isAuthenticated) {
            const { active, domain, max_rating, min_rating } = globalState.client

            if (!active) {
                pushAlert({
                    type: "danger",
                    message: "Your account is not active. Complete payment or confirm email to start generating recommendations. Contact support if problem persists."
                })
            }
            if (domain === "") {
                pushAlert({
                    type: "danger",
                    message: "You have not set your website domain. This is required for security reasons. Set it now to start generating recommendations."
                })
            }
            if (max_rating === min_rating) {
                pushAlert({
                    type: "danger",
                    message: "You have set invalid maximum and minimum ratings. They can not have the same value. Read the documentation for further advice."
                })
            }
        }
        return
    }, [])

    const removeAlert = e => {
        let alerts = [...globalState.alerts]
        alerts = alerts.filter(item => {
            return item != {
                message: e.target.message,
                type: e.target.type
            }
        })
    }

    return (
        <Fragment>
            {
                globalState.alerts.map(({ type, message }, i) => {
                    return <Alert key={i} closeCallback={removeAlert.bind(this)} type={type} message={message} />
                })
            }
        </Fragment>
    )
}

export default AlertBar