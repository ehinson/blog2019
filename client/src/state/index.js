import { configureStore } from 'redux-starter-kit';
import { reducer as formReducer } from 'redux-form';
import testReducer from './reducers';

const store = configureStore({
  reducer: {
    test: testReducer,
    form: formReducer
  }
});

export default store;
