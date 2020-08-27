import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import GlobalContext from '../../../context/global/GlobalContext'

const SuccessComponent = () => {
  const globalState = useEffect(GlobalContext)

  // useEffect(() => {
  //   globalState.pushAlert({
  //     type: "success",
  //     message: "Success! Your account is now registered."
  //   });
  // }, [])

  return (
    <Redirect to="/account" />
  )
}

export default SuccessComponent