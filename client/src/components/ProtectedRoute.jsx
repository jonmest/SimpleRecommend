import React, { useContext, useEffect, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import GlobalContext from '../context/global/GlobalContext'
import Cookies from 'js-cookie'
import { useHistory } from "react-router-dom";
import Loader from 'react-loader-spinner'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const globalState = useContext(GlobalContext)
  const history = useHistory()

  useEffect(() => {
    if (globalState.isAuthenticated === false && Cookies.get('token') !== '') {
      globalState.setLoading(true)

      fetch(process.env.REACT_APP_PROVIDER_API_URL + '/account', {
        method: 'get', mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('token')
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.status == "success" && data.data) {
            globalState.setClient(data.data)
            globalState.setIsAuthenticated(true)
            history.push('/account')
          }
        })
        .then(() => {
          globalState.setLoading(false)
        })
        .catch(() => globalState.setLoading(false));
    };
  }, [])

  const { isAuthenticated, loading } = globalState

  return (
    globalState.loading ?
      <Loader
        type="Puff"
        color="#00BFFF"
        height={100}
        width={100} //3 secs   
      /> : <Route {...rest} render={props => !isAuthenticated ? (
        <Redirect to='/login' />
      ) : (
          <Component {...props} />
        )
      } />
  )
}

export default ProtectedRoute