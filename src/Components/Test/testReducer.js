import { INCREMENT_COUNTER, DECREMENT_COUNTER } from "./testConstants";
import { createReducer } from "../../app/common/util/reducerUtil"

const initialState = {
    data:37
}

export const incrementCounter = (state, payload) => {
    return {...state, data:state.data + 1}; 
}

export const decrementCounter = (state, payload) => {
    return {...state, data:state.data - 1}; 
}

/*
const testReducer = (state = initialState, action) => {
    switch(action.type) {
        case INCREMENT_COUNTER:
            
        case DECREMENT_COUNTER:
            return {...state, data:state.data - 1};
        default:
            return state;
    }

}
*/
export default createReducer(initialState, {
    [INCREMENT_COUNTER]: incrementCounter,
    [DECREMENT_COUNTER]: decrementCounter
})