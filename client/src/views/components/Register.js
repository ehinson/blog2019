import React from 'react';
import { Field, reduxForm } from 'redux-form';
import axios from 'axios';


const validate = values => {
    const errors = {};
    if (!values.username) {
        errors.username = 'Required';
    }
    if (!values.password) {
        errors.password = 'Required';
    }
    return errors;
};

export const createUser = async (values, dispatch) => {
  try {
    const {data} = await axios.post('/api/register', values);
    return data
  } catch (error) {
    console.error(error.response);
    return error
  } 
}

// API call to validate values
const asyncValidate = (values /*, dispatch */) => {
  return createUser(values).then(({response}) => {
    console.log(response.data.errors.username, values);
    
    // simulate server latency
    if (Object.keys(response.data.errors).includes('username')) {
      throw { username: `${response.data.errors.username.msg}` }
    }

    if (Object.keys(response.data.errors).includes('email')) {
      throw { email: `${response.data.errors.email.msg}` }
    }
  })
}

const renderField = (
    { input, label, type, meta: { asyncValidating, touched, error } },
  ) => (
    <div>
      <label>{label}</label>
      <div className={asyncValidating ? 'async-validating' : ''}>
        <input {...input} type={type} placeholder={label} />
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  );

const AsyncValidationForm = props => {
    const { handleSubmit, pristine, reset, submitting } = props;
    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="username"
          type="text"
          component={renderField}
          label="Username"
        />
        <Field
          name="email"
          type="text"
          component={renderField}
          label="Email"
        />
        <Field
          name="password"
          type="password"
          component={renderField}
          label="Password"
        />
        <Field
          name="password__confirmation"
          type="password"
          component={renderField}
          label="Password Confirmation"
        />
        <div>
          <button type="submit" disabled={submitting}>Sign Up</button>
          <button type="button" disabled={pristine || submitting} onClick={reset}>
            Clear Values
          </button>
        </div>
      </form>
    );
  };
  
  export default reduxForm({
    form: 'asyncValidation', // a unique identifier for this form
    validate,
    asyncValidate,
    asyncBlurFields: ['username', 'email'],
  })(AsyncValidationForm);