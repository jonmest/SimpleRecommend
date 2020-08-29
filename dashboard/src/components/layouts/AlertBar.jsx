import React, { Fragment, useState, useEffect, useContext } from 'react'
import Alert from './Alert'
import GlobalContext from '../../context/global/GlobalContext'

const AlertBar = () => {
    const globalState = useContext(GlobalContext)
    const { setAlerts } = globalState

    useEffect(() => {
        if (globalState.isAuthenticated) {
            const { active, domain, max_rating, min_rating } = globalState.client
            const newAlerts = {}
            if (!active) {
                newAlerts["inactive"] = {
                    id: "inactive",
                    type: "danger",
                    message: "Your account is not active. Complete payment if you have not, or wait a few minutes. Contact support if problem persists."
                }
            }
            if (domain === "") {
                newAlerts["noDomain"] = {
                    id: "noDomain",
                    type: "danger",
                    message: "You have not set your website domain. This is required for security reasons. Set it now to start generating recommendations."

                }
            }
            if (max_rating === min_rating) {
                newAlerts["badRatings"] = {
                    id: "badRatings",
                    type: "danger",
                    message: "You have currently have invalid maximum and minimum ratings set. They can not have the same value. Read the documentation for further advice."
                }
            }

            setAlerts(newAlerts)
        }
        return
    }, [globalState.isAuthenticated])

    const removeAlert = e => {
        let alerts = { ...globalState.alerts }
        alerts[e.target.parentElement.id] = null
        setAlerts(alerts)
    }

    return (
        <Fragment>
            {
                Object.values(globalState.alerts).map((item, i) => {
                    if (item === null) return
                    const { type, message, id } = item
                    return <Alert id={id} key={i} closeCallback={removeAlert.bind(this)} type={type} message={message} />
                })
            }
        </Fragment>
    )
}

export default AlertBar