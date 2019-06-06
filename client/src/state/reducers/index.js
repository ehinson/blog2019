import { createReducer, createAction } from 'redux-starter-kit';

const todosReducer = createReducer([], {
  ADD_TODO: (state, action) => {
    // "mutate" the array by calling push()
    state.push(action.payload);
  },
  TOGGLE_TODO: (state, action) => {
    const todo = state[action.payload.index];
    // "mutate" the object by overwriting a field
    todo.completed = !todo.completed;
  },
  REMOVE_TODO: (state, action) => {
    // Can still return an immutably-updated value if we want to
    return state.filter((todo, i) => i !== action.payload.index);
  }
});

const increment = createAction('counter/increment');
const decrement = createAction('counter/decrement');

const counterReducer = createReducer(0, {
  [increment]: (state, action) => state + action.payload,
  [decrement]: (state, action) => state - action.payload
});

export default todosReducer;
