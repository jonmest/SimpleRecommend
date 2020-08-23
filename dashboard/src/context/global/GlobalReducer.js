import {
    SET_SIGNUP_STATE,
    SET_CLIENT_STATE,
    SET_IS_LOGGED_IN
} from '../types'

export default (state, action) => {
    switch (action.type) {
        case SET_SIGNUP_STATE:
            return {
                ...state,
                signupProcess: {
                    ...state.signupProcess,
                    ...action.payload
                }
            }
        case SET_CLIENT_STATE:
            return {
                ...state,
                client: action.payload
            }
        case SET_IS_LOGGED_IN:
            return {
                ...state,
                isAuthenticated: action.payload
            }
        default:
            return state;
    }
}