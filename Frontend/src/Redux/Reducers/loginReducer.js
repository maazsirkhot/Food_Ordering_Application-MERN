import {SIGN_UP, SIGN_IN, SIGN_OUT} from '../Constants/constants';

const initialState = {
    signinstatus : null,
    signinmessage : null,
    signupstatus : null,
    signupmessage : null
}

export default function loginReducer(state = initialState, action){
    if(action.type == SIGN_UP){
        return Object.assign({}, state, {
            signinstatus : null,
            signinmessage : null,
            signupstatus : action.payload.signupstatus,
            signupmessage : action.payload.signupmessage
        })
    } else if(action.type == SIGN_IN){
        return Object.assign({}, state, {
            signinstatus : action.payload.signinstatus,
            signinmessage : action.payload.signinmessage,
            signupstatus : null,
            signupmessage : null
        })
    } else if(action.type == SIGN_OUT){
        return initialState;
    }
    return state;
}

