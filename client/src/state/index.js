import { configureStore } from 'redux-starter-kit'
import usersReducer from './reducers'
import { reducer as formReducer } from 'redux-form'


const store = configureStore({
    reducer: {
      users: usersReducer,
      form: formReducer,
    }
  })

export default store