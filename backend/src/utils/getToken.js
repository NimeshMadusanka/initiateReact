const jwt = require('jsonwebtoken');
const randomString = require('randomstring');

const getToken = (userId, key, expiresIn) => jwt.sign(
  {
    userId,
  },
  key,
  {
    expiresIn,
  },
);

const verifyToken = () => {
  const verificationToken = randomString.generate({
    length: 512,
    charset: 'alphanumeric',
  });
  const verificationTokenTimeStamp = new Date();
  return {
    verificationToken,
    verificationTokenTimeStamp: verificationTokenTimeStamp.getTime(),
  };
};

const joiErrorFormatter = (RawErrors) => {
  const errors = {};
  const Details = RawErrors.details;

  Details.map((detail) => {
    errors[detail.path] = [detail.message];
  });
  return errors;
};

module.exports = {
  getToken,
  verifyToken,
  joiErrorFormatter,
};
