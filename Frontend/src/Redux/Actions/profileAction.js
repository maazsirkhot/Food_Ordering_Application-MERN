import { PROFILE_UPDATE } from '../Constants/constants';

export function profileupdate(profiledata){
    return {
        type : PROFILE_UPDATE,
        payload : {
            profileupdate : profiledata.profileupdate,
            getprofile : profiledata.getprofile
        }
    }
}
