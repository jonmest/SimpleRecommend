import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import GlobalContext from '../../../context/global/GlobalContext'


const VerifyEmail = () => {
    const { token } = useParams()

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
            .then(res => res.json())
            .then(data => console.log(data))
    }, [])

    return (
        null
    )
}

export default VerifyEmail