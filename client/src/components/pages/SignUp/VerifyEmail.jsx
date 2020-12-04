import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import GlobalContext from '../../../context/global/GlobalContext'
import { useAlert } from 'react-alert'

const VerifyEmail = () => {
    const { token } = useParams()
    const globalState = useContext(GlobalContext)
    const alert = useAlert()

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
                alert.show('You successfully verified your email address!', {type: 'success'})
            })
            .catch(error => {
                alert.show('You failed to verify your email address. Try again later.', {type: 'error'})
            })
    }, [])

    return (
        <Redirect to="/account" />
    )
}

export default VerifyEmail