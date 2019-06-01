import { configureStore } from 'redux-starter-kit'
import testReducer from './reducers'
import { reducer as formReducer } from 'redux-form'


const store = configureStore({
    reducer: {
      test: testReducer,
      form: formReducer,
    }
  })

export default store