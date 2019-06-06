// // https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
// /^
//   (?=.*\d)          // should contain at least one digit
//   (?=.*[a-z])       // should contain at least one lower case
//   (?=.*[A-Z])       // should contain at least one upper case
//   [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
//   (?=.{8,})
//   (?=.*[!@#\$%\^&\*])
// $/

const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
