import React, { useReducer } from 'react'
import GlobalContext from './GlobalContext'
import GlobalReducer from './GlobalReducer'
import {
    SET_SIGNUP_STATE,
    SET_CLIENT_STATE,
    SET_IS_LOGGED_IN
} from '../types'
import Cookies from 'js-cookie'

const GlobalState = props => {

    const initialState = {
        client: null,
        signupProcess: null,
        isAuthenticated: false,
        loading: false
    }

    const [state, dispatch] = useReducer(GlobalReducer, initialState)

    const setClient = state => {
        dispatch({
            type: SET_CLIENT_STATE,
            payload: state
        })
    }

    const setIsAuthenticated = bool => {
        dispatch({
            type: SET_IS_LOGGED_IN,
            payload: bool
        })
    }

    const setSignupProcess = state => {
        dispatch({
            type: SET_SIGNUP_STATE,
            payload: state
        })
    }
    
    return <GlobalContext.Provider
    value={{
        client: state.client,
        signupProcess: state.signupProcess,
        client: state.client,
        isAuthenticated: state.isAuthenticated,
        setIsAuthenticated,
        setSignupProcess,
        setClient,
        loading: state.loading

    }}>

        { props.children }
    </GlobalContext.Provider>
}

export default GlobalState