import React from 'react'
import { Field, reduxForm } from 'redux-form'
import axios from 'axios'

const SimpleForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  const submit = async (values) => {
    try {
      const {data} = await axios.post('/register', {...values})
      console.log(data)
    } catch (error) {
      console.log(error) 
    }
  }
  return (
    <form onSubmit={handleSubmit(submit)}>
      <div>
        <label>Username</label>
        <div>
          <Field
            name="username"
            component="input"
            type="text"
            placeholder="Username"
          />
        </div>
      </div>
      <div>
        <label>Email</label>
        <div>
          <Field
            name="email"
            component="input"
            type="email"
            placeholder="Email"
          />
        </div>
      </div>
      <div>
        <label>Password</label>
        <div>
          <Field
            name="password"
            component="input"
            type="password"
            placeholder="Password"
          />
        </div>
      </div>
      <div>
        <label>Password</label>
        <div>
          <Field
            name="password__confirmation"
            component="input"
            type="password"
            placeholder="Password"
          />
        </div>
      </div>
      <div>
        <button type="submit" disabled={pristine || submitting}>
          Register
        </button>
        <button type="button" disabled={pristine || submitting}>
          Sign In
        </button>
      </div>
    </form>
  )
}

const App = reduxForm({
  form: 'register' // a unique identifier for this form
})(SimpleForm)

export default App;