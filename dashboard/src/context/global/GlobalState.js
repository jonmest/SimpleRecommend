import React, { useReducer } from 'react'
import GlobalContext from './GlobalContext'
import GlobalReducer from './GlobalReducer'
import {
    SET_SIGNUP_STATE
} from '../types'

const GlobalState = props => {

    const initialState = {
        isAuthenticated: false,
        client: null,
        bearToken: null,
        signupProcess: {
            currentStep: 1,
            username: "",
            email: "",
            password1: "",
            password2: "",
            plan: "",
            priceId: ""
        }
    }


    const [state, dispatch] = useReducer(GlobalReducer, initialState)

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
        setSignupProcess

    }}>

        { props.children }
    </GlobalContext.Provider>
}

export default GlobalState