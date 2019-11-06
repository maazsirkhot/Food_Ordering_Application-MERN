import {PROFILE_UPDATE} from '../Constants/constants';

const initialState = {
    
}

export default function (state = initialState, action) {
    switch (action.type) {
        case PROFILE_UPDATE :
            return Object.assign({}, state, {
                profileupdate : action.payload.profileupdate,
                getprofile : action.payload.getprofile
            })
        default:
            return state;
    }
}