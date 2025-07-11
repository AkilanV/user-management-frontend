import { combineReducers } from "@reduxjs/toolkit";
import loaderReducer from './feaures/loading/loaderSetUpSlice';


    const rootReducer = combineReducers({
        loaderState: loaderReducer,
    });


    
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;