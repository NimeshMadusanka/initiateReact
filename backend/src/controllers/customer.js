const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const checkAuth = require('../middleware/auth');
const checkAuth2 = require('../middleware/Customer');
const Customer = require('../models/Customer'); // import relevant model from models
const { customerSchema } = require('../validations/Customer');
const { verifyToken } = require('../utils/getToken');
const { validateInput } = require('../utils/common-functions');

/**
 * @swagger
 * components:
 *   schemas:
 *      Customer:
 *       type: object
 *       required:
 *
 *       properties:
 *         firstName:
 *           type: string
 *           description: firstName of the user
 *         lastName:
 *           type: string
 *           description: lastName of the user
 *         email:
 *           type: string
 *           description: email of the user
 *         password:
 *           type: string
 *           description: password of the user
 *
 *
 *       example:
 *          firstName : sampleName
 *          lastName : sampleName
 *          email : sample@example.com
 *          password : samplePassword
 *
 */

/**
 * @swagger
 * tags :
 *  name : Customer
 *  description : The customer managing API
 */

router.post('/', async (req, res) => {
  try {
    const validUser = validateInput(customerSchema, req.body);

    if (!validUser.value) {
      return res.status(403).json(validUser);
    }

    const { firstName, lastName, email, password, phoneNumber } =
      validUser.value;
    // check if there is a user with the same email
    const existsUser = await Customer.findOne({ email });
    if (existsUser) {
      return res.status(401).json('Email already exists!');
    }
    // set verificationToken, verificationTokenTimeStamp
    const verifyTokens = verifyToken();

    // create a new user
    const NewUser = new Customer({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      location: null,
    });

    const salt = await bcrypt.genSalt(10);
    NewUser.password = await bcrypt.hash(password, salt);
    NewUser.verificationToken = verifyTokens.verificationToken;
    NewUser.verificationTokenTimeStamp =
      verifyTokens.verificationTokenTimeStamp;
    const data = await NewUser.save();

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/getData', checkAuth2, async (req, res) => {
  try {
    const data = await Customer.findById(req.user.userId);
    console.log('user', data);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put('/addLocation/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const ValidUser = validateInput(customerSchema, req.body);
    if (!ValidUser.value) {
      return res.status(403).json(ValidUser);
    }
    const validUser = await Customer.findById(userId);

    if (!validUser) {
      return res.status(404).json('User not found!');
    }

    const { apartmentNo, zipCode, address, nickName } = ValidUser.value;

    const userUpdate = [
      {
        apartmentNo,
        zipCode,
        address,
        nickName,
      },
    ];

    await Customer.updateOne(
      { _id: userId },
      {
        $push: {
          location: userUpdate,
        },
      }
    );
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Customer.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json('User not found!');
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/', checkAuth, async (req, res) => {
  try {
    const authUser = await Customer.findById(req.user.userId);

    const ValidUser = validateInput(customerSchema, req.body);
    if (!ValidUser.value) {
      return res.status(403).json(ValidUser);
    }
    const userId = authUser.id;
    const validUser = await Customer.findById(userId);

    const emailDuplicate = await Customer.findOne({
      email: new RegExp(`^${validUser.email}$`, 'i'),
      _id: { $ne: mongoose.Types.ObjectId(userId) },
    });

    if (emailDuplicate) {
      return res.sendStatus(403);
    }
    const { firstName, lastName, email, phoneNumber } = ValidUser.value;

    const userUpdate = {
      firstName,
      lastName,
      email,
      phoneNumber,
    };

    await Customer.findByIdAndUpdate(userId, userUpdate);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.get('/', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);
    console.log('user', AuthUserData);
    if (['franchisor', 'franchisee'].includes(AuthUserData.role)) {
      const data = await Customer.find();
      return res.status(200).json(data);
    }
    return res.sendStatus(401);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
