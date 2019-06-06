import * as yup from 'yup';
import axios from 'axios';

// // https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
// /^
//   (?=.*\d)          // should contain at least one digit
//   (?=.*[a-z])       // should contain at least one lower case
//   (?=.*[A-Z])       // should contain at least one upper case
//   [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
//   (?=.{8,})
//   (?=.*[!@#\$%\^&\*])
// $/

export const strongRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
);

export const registerValidationSchema = yup.object().shape({
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

// Async Registration Validation
export const asyncValidate = async values => {
  try {
    const { data } = await axios.post('/api/validate', values);
    return data;
  } catch (error) {
    throw error;
  }
};

export const registerValidate = values => {
  return asyncValidate(values)
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
