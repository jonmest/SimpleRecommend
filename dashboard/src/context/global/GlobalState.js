import React, { useReducer } from 'react'
import GlobalContext from './GlobalContext'
import GlobalReducer from './GlobalReducer'
import {
    SET_SIGNUP_STATE,
    SET_CLIENT_STATE
} from '../types'

const GlobalState = props => {

    const initialState = {
        isAuthenticated: false,
        client: null,
        bearToken: null,
        signupProcess: null
    }


    const [state, dispatch] = useReducer(GlobalReducer, initialState)

    const setClient = state => {
        dispatch({
            type: SET_CLIENT_STATE,
            payload: state
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
        bearToken: state.bearToken,
        isAuthenticated: state.isAuthenticated,
        client: state.client,
        setSignupProcess,
        setClient

    }}>

        { props.children }
    </GlobalContext.Provider>
}

export default GlobalState