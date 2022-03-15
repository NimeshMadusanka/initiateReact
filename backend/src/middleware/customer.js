const jwt = require('jsonwebtoken');

const db = require('../models/index');

module.exports = async (req, res, next) => {
  try {
    console.log('auth');
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;

    const { userId } = req.user;

    db.Customer.findById({ _id: userId });
    next();
  } catch (error) {
    console.log(error);
    const details = JSON.parse(JSON.stringify(error));
    if (details.message) {
      return res.sendStatus(403);
    }
    // audit - email;
    return res.sendStatus(401);
  }
};
