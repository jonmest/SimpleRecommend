import {
    SET_SIGNUP_STATE,
    SET_CLIENT_STATE
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
                client: {
                    username: action.payload.username,
                    id: action.payload.id,
                    email: action.payload.email
                }
            }
        default:
            return state;
    }
}