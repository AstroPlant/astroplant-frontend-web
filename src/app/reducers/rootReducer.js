import { combineReducers } from 'redux'
import testReducer from '../../Components/Test/testReducer'
import reducers from '../../Components/Redux/reducers'
import pieReducer from '../../Components/Redux/pieReducer'

const rootReducer = combineReducers({
    test: testReducer,
    data: reducers,
    pieData: pieReducer
})

export default rootReducer