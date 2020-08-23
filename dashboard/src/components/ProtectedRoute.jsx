import React, { useContext, useEffect, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import GlobalContext from '../context/global/GlobalContext'
import Cookies from 'js-cookie'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const globalState = useContext(GlobalContext)
  const { client } = globalState
  const token = Cookies.get('token')
  const [permitted, setPermitted] = useState(false)

  useEffect(() => {
    if (client && token) {
        setPermitted(true)
        return
    } else if (token) {
        fetch(process.env.REACT_APP_PROVIDER_API_URL + '/account', {
            method: 'get', mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
              priceId: globalState.signupProcess.priceId
            })})
            .then(res => res.json())
            .then(res => res.data)
            .then(data => {
                globalState.setClient({...data})
                setPermitted(true)
            })
            .catch(e => {
                console.log(e)
            })
    } else return // Not permitted
  }, [])


  return (
    <Route {...rest} render={
      props => {
        if (permitted) {
          return <Component {...rest} {...props} />
        } else {
          return <Redirect to={
            {
              pathname: '/'
            }
          } />
        }
      }
    } />
  )
}

export default ProtectedRoute