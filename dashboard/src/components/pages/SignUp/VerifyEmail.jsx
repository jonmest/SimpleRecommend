import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import GlobalContext from '../../../context/global/GlobalContext'


const VerifyEmail = () => {
    const { token } = useParams()
    const globalState = useContext(GlobalContext)
    const { setAlerts } = globalState

    useEffect(() => {
        fetch(process.env.REACT_APP_PROVIDER_API_URL + '/verify-email-token', {
            method: 'post', mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token
            })
        })
            .then(res => {
                if (res.ok) {
                    return
                } else throw new Error("Could not validate and verify token.")
            })
            .then(() => {
                debugger
                setAlerts({
                    "verifiedToken": {
                        id: "verifiedToken",
                        type: "success",
                        message: "You successfully verified your email address!"
    
                    }
                })
            })
            .catch(error => {
                console.log(error)
                setAlerts({
                    "vailedToVerifyEmail": {
                        id: "vailedToVerifyEmail",
                        type: "danger",
                        message: "You failed to verify your email address. Try again later."
    
                    }
                })
            })
    }, [])

    return (
        <Redirect to="/account" />
    )
}

export default VerifyEmail