import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .ensure()
    .required(),
  email: yup
    .string()
    .ensure()
    .email()
    .required(),
  password: yup
    .string()
    .ensure()
    .required()
    .test('password', 'passwords must match', function(value) {
      const { password__confirmation } = this.parent;
      return value === password__confirmation;
    }),
  password__confirmation: yup
    .string()
    .ensure()
    .required()
    .test('password__confirmation', 'passwords must match', function(value) {
      const { password } = this.parent;
      return value === password;
    })
});

// Async Validation
const sleep = async values => {
  try {
    const { data } = await axios.post('/api/register', values);
    return data;
  } catch (error) {
    throw error;
  }
};

const validate = values => {
  return sleep(values)
    .then(val => val)
    .catch(err => {
      const inputErrors = {};
      const {
        response: {
          data: { errors }
        }
      } = err;

      if (Object.keys(errors).length) {
        Object.keys(errors).forEach(field => {
          inputErrors[field] = errors[field].msg;
        });
      }

      throw inputErrors;
    });
};

const RegisterForm = () => (
  <div>
    <h1>Any place in your app!</h1>
    <Formik
      initialValues={{ username: '', email: '', password: '', password__confirmation: '' }}
      validate={validate}
      validateOnBlur
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Fragment>
          <Form>
            <Field type="text" name="username" />
            <ErrorMessage name="username" component="div" />

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
  </div>
);

export default RegisterForm;
