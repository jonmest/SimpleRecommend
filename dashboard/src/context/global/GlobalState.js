import React, { useReducer } from 'react'
import GlobalContext from './GlobalContext'
import GlobalReducer from './GlobalReducer'
import {
    SET_SIGNUP_STATE,
    SET_CLIENT_STATE,
    SET_IS_LOGGED_IN,
    PUSH_ALERT,
    SET_LOADING
} from '../types'
import Cookies from 'js-cookie'

const GlobalState = props => {

    const initialState = {
        client: null,
        signupProcess: null,
        isAuthenticated: false,
        loading: false,
        alerts: []
    }

    const [state, dispatch] = useReducer(GlobalReducer, initialState)

    const setLoading = bool => [
        dispatch({
            type: SET_LOADING,
            payload: bool
        })
    ]

    const pushAlert = payload => {
        const pl = [...state.alerts, payload]
        dispatch({
            type: PUSH_ALERT,
            payload: pl
        })
    }

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
            alerts: state.alerts,
            setIsAuthenticated,
            setSignupProcess,
            setClient,
            pushAlert,
            setLoading,
            loading: state.loading

        }}>

        {props.children}
    </GlobalContext.Provider>
}

export default GlobalState