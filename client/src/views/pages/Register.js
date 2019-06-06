import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';

import { registerValidationSchema, registerValidate } from '../../validation/index';
import CustomInputComponent from '../components/TextInput';

const RegisterForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  return (
    <div>
      <h1>Any place in your app!</h1>
      <Formik
        initialValues={{ username: '', email: '', password: '', password__confirmation: '' }}
        validate={registerValidate}
        validationSchema={registerValidationSchema}
        validateOnChange={false}
        validateOnBlur
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await axios.post('/api/register', values);
            setSubmitSuccess(true);
          } catch (error) {
            setSubmitting(false);
            throw error;
          }
        }}
      >
        {({ isSubmitting }) => (
          <Fragment>
            <Form>
              <Field
                type="text"
                name="username"
                component={CustomInputComponent}
                placeholder="Username"
              />

              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" />

              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" />

              <Field type="password" name="password__confirmation" />
              <ErrorMessage name="password__confirmation" component="div" />

              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          </Fragment>
        )}
      </Formik>
      {submitSuccess && <Redirect to="/login/" />}
    </div>
  );
};

export default RegisterForm;
