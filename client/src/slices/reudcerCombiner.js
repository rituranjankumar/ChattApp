import {combineReducers} from "@reduxjs/toolkit";

import authReducer from "./authSlice"
import profileReducer from "./ProfileSlice";
 import onLineUserReducer from "./onlineUserSlice"
const rootReducer  = combineReducers({
    auth: authReducer,
    profile:profileReducer,
    onLineUser:onLineUserReducer
})

export default rootReducer