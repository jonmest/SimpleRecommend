import React, { useContext, useEffect, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import GlobalContext from '../context/global/GlobalContext'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const globalState = useContext(GlobalContext)
  const { isAuthenticated, loading } = globalState
  
  return (
    <Route {...rest} render={ props => !isAuthenticated && !loading ? (
        <Redirect to='/login'/>
      ) : (
      <Component {...props}/>
      )
    }/>
  )
}

export default ProtectedRoute