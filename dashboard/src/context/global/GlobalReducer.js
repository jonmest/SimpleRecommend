import {
    SET_SIGNUP_STATE
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
        default:
            return state;
    }
}