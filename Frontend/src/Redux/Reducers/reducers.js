import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import profileReducer from './profileReducer';

const rootReducer = combineReducers({
    userLoginData: loginReducer,
    profileData : profileReducer
});

export default rootReducer;