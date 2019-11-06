import {SIGN_UP, SIGN_IN, SIGN_OUT} from '../Constants/constants';

export function signup(signupdata){
    return {
        type : SIGN_UP,
        payload : {
            signupstatus : signupdata.signupstatus,
            signupmessage : signupdata.signupmessage
        }
    }
}

export function signin(signindata){
    return {
        type : SIGN_IN,
        payload : {
            signinstatus : signindata.signinstatus,
            signinmessage : signindata.signinmessage
        }
    }
}

export function signout(){
    localStorage.clear();
    return { type: SIGN_OUT}
}