const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // import relevant model from models
const { UserSchema } = require('../validations/UserValidation');
const checkAuth = require('../middleware/auth');
const { verifyToken } = require('../utils/getToken');
const { validateInput } = require('../utils/common-functions');

/**
 * @swagger
 * components:
 *   schemas:
 *      User:
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
 *         arNumber:
 *           type: string
 *           description: arNumber of the user
 *         adviceFirm:
 *           type: string
 *           description: adviceFirm of the user
 *         dealerGroup:
 *           type: string
 *           description: dealerGroup of the user
 *         stateResidence:
 *           type: string
 *           description: User's stateResidence [ "Australia wide","Northern Territory","Western Australia" "Tasmania","South Australia","Queensland","New South Wales", ],
 *         contactNumber:
 *           type: string
 *           description: contactNumber of the user
 *         mobileNumber:
 *           type: string
 *           description: mobileNumber of the user
 *         postalAddress:
 *           type: string
 *           description: postalAddress of the user
 *         logo:
 *           type: string
 *           description: logo of the user
 *         DOB:
 *           type: Date
 *           description: DOB of the user
 *         madenName:
 *           type: string
 *           description: madenName of the user
 *         PSA:
 *           type: string
 *           description: PSA of the user
 *         status:
 *            type: String
 *            description: User's status ["active", "inactive", "pending", "tempBlock"]
 *         role:
 *           type: string
 *           description: role of the user ["admin", "advisor"]
 *         lastSeen:
 *           type: Date
 *           description: lastSeen of the user
 *         AVT:
 *           type: string
 *           description: AVT of the user
 *         PRT:
 *           type: string
 *           description: PRT of the user
 *         prefred:
 *           type: Boolean
 *           description: prefred of the user
 *         CFLT:
 *           type: Number
 *           description: CFLT of the user
 *         clientsCount:
 *           type: Number
 *           description: clientsCount of the user
 *         accountType:
 *           type: ObjectId
 *           description: accountType of the user ["trail", "paid"]
 *         PreferredList:
 *           type: string
 *           description: PreferredList of the user
 *
 *       example:
 *          firstName : sampleName
 *          lastName : sampleName
 *          email : sample@example.com
 *          password : samplePassword
 *          arNumber : sampleArNumber
 *          adviceFirm : sampleAdviceFirm
 *          dealerGroup : sampleDealerGroup
 *          stateResidence : Australia wide
 *          contactNumber : sampleNameContactNumber
 *          mobileNumber : sampleMobileNumber
 *          postalAddress : samplePostalAddress
 *          logo : image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==
 *          DOB : sampleDOB
 *          madenName : sampleMadenName
 *          status : active
 *          PSA : samplePSA
 *          role : admin
 *          lastSeen : sampleLastSeen
 *          AVT : sampleAVT
 *          PRT : samplePRT
 *          VTTS : sampleVTTS
 *          prefred : false
 *          CFLT : sampleCFLT
 *          clientsCount : sampleClientsCount
 *          accountType : trail
 *          PreferredList : samplePreferredList
 */

/**
 * @swagger
 * tags :
 *  name : Users
 *  description : The users managing API
 */

router.post('/', checkAuth, async (req, res) => {
  try {
    const validUser = validateInput(UserSchema, req.body);

    if (!validUser.value) {
      return res.status(403).json(validUser);
    }

    const authUser = await User.findById(req.user.userId);

    const {
      fID,
      firstName,
      email,
      password,
      suitNo,
      address,
      serviceRegions,
      royaltyScheme,
      note,
      ownerName,
    } = validUser.value;

    const extract = (array, newarray) => {
      if (!newarray) newarray = [];
      if (array)
        for (var i = 0; i < array.length; ++i) {
          if (array[i].constructor.name === 'Array')
            extract(array[i], newarray);
          else newarray.push(array[i]);
        }
      return newarray;
    };

    const currentZips = [];
    const userData = await User.find();
    let zips = userData.map((e) => e.serviceRegions);
    let allInOne = await extract(zips);
    currentZips.push([...allInOne]);

    function intersect_arrays(a, b) {
      var sorted_a = a.concat().sort();
      var sorted_b = b.concat().sort();
      var common = [];
      var a_i = 0;
      var b_i = 0;

      while (a_i < a.length && b_i < b.length) {
        if (sorted_a[a_i] === sorted_b[b_i]) {
          common.push(sorted_a[a_i]);
          a_i++;
          b_i++;
        } else if (sorted_a[a_i] < sorted_b[b_i]) {
          a_i++;
        } else {
          b_i++;
        }
      }
      return common;
    }

    const mergeArray = currentZips.flat(2);
    const intersections = intersect_arrays(mergeArray, serviceRegions);

    if (intersections.length > 0) {
      return res.status(403).json('Zip code already exists');
    }

    // check if there is a user with the same email
    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res.status(401).json('Email already exists!');
    }
    // set verificationToken, verificationTokenTimeStamp
    const verifyTokens = verifyToken();

    if (['franchisor'].includes(authUser.role)) {
      // create a new user
      const NewUser = new User({
        fID,
        firstName,
        email,
        password,
        suitNo,
        address,
        serviceRegions,
        royaltyScheme,
        note,
        ownerName,
      });

      const salt = await bcrypt.genSalt(10);
      NewUser.password = await bcrypt.hash(password, salt);
      NewUser.verificationToken = verifyTokens.verificationToken;
      NewUser.verificationTokenTimeStamp =
        verifyTokens.verificationTokenTimeStamp;
      await NewUser.save();

      return res.sendStatus(200);
    }
    return res.sendStatus(401);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/:id', checkAuth, async (req, res) => {
  try {
    const ValidUser = validateInput(UserSchema, req.body);
    if (!ValidUser.value) {
      return res.status(403).json(ValidUser);
    }
    const AuthUserData = await User.findById(req.user.userId); // Get logged user data
    const userId = req.params.id;
    const validUser = await User.findById(userId);

    const emailDuplicate = await User.findOne({
      email: new RegExp(`^${validUser.email}$`, 'i'),
      _id: { $ne: mongoose.Types.ObjectId(userId) },
    });

    if (emailDuplicate) {
      return res.sendStatus(403);
    }
    const {
      fID,
      firstName,
      ownerName,
      email,
      address,
      serviceRegions,
      royaltyScheme,
      note,
    } = ValidUser.value;

    const { suitNo } = req.body;

    const extract = (array, newarray) => {
      if (!newarray) newarray = [];
      if (array)
        for (var i = 0; i < array.length; ++i) {
          if (array[i].constructor.name === 'Array')
            extract(array[i], newarray);
          else newarray.push(array[i]);
        }
      return newarray;
    };
    const currentZips = [];

    let serviceRegionsUpdate = validUser.serviceRegions;
    const userData = await User.find();
    let zips = userData.map((e) => e.serviceRegions);
    let allInOne = await extract(zips);
    currentZips.push([...allInOne]);

    function intersect_arrays(a, b) {
      var sorted_a = a.concat().sort();
      var sorted_b = b.concat().sort();
      var common = [];
      var a_i = 0;
      var b_i = 0;

      while (a_i < a.length && b_i < b.length) {
        if (sorted_a[a_i] === sorted_b[b_i]) {
          common.push(sorted_a[a_i]);
          a_i++;
          b_i++;
        } else if (sorted_a[a_i] < sorted_b[b_i]) {
          a_i++;
        } else {
          b_i++;
        }
      }
      return common;
    }

    const mergeArray = currentZips.flat(2);
    const intersections = intersect_arrays(mergeArray, serviceRegions);

    const zipsToDeleteSet = new Set(serviceRegionsUpdate);

    const uniqueArrayInUpdate = intersections.filter((zip) => {
      return !zipsToDeleteSet.has(zip);
    });

    if (uniqueArrayInUpdate.length > 0) {
      return res.status(403).json('Zip code already exists');
    }

    const userUpdate = {
      fID,
      firstName,
      ownerName,
      email,
      suitNo,
      address,
      serviceRegions,
      royaltyScheme,
      note,
    };
    if (!['franchisor'].includes(AuthUserData.role)) {
      // changed admin to companyAdmin
      delete userUpdate.role;
      userId.id = req.user.userId; // avoid access of other users to behave like admin
    }
    //await User.findByIdAndUpdate(userId, userUpdate);
    return res.sendStatus(200);
  } catch (error) {
    console.log('error', error);
    return res.sendStatus(500);
  }
});

router.get('/getZips', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);
    if (AuthUserData.role === 'franchisee') {
      const data = await User.findById(req.user.userId);
      return res.status(200).json(data);
    }
    return res.sendStatus(401);
  } catch (error) {
    return res.sendStatus(500);
  }
});

/**
 * @swagger
 * /user:
 *  get:
 *      summary: Get all users (Protected)
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: Successfully get all users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items :
 *                              $ref:   '#/components/schemas/User'
 *          403:
 *              description: Validation Error
 *          400:
 *              description: Bad Request
 *
 */
router.get('/getFranchisee', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);
    if (['franchisor'].includes(AuthUserData.role)) {
      // changed admin to companyAdmin
      const data = await User.find({ role: 'franchisee' }).select(
        'fID firstName status ownerName email suitNo address serviceRegions royaltyScheme note createdAt'
      );
      return res.status(200).json(data);
    }
    return res.sendStatus(401);
  } catch (error) {
    return res.sendStatus(500);
  }
});
router.get('/:id', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);
    if (
      AuthUserData.role === 'franchisor' ||
      AuthUserData.role === 'franchisee'
    ) {
      const data = await User.findById(req.params.id).select(
        'fID firstName status ownerName email suitNo address serviceRegions royaltyScheme note '
      );
      return res.status(200).json(data);
    }
    return res.sendStatus(401);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);
    if (['franchisor', 'franchisee'].includes(AuthUserData.role)) {
      // changed admin to companyAdmin
      const data = await User.find().select(
        'fID firstName status ownerName email suitNo address serviceRegions royaltyScheme note'
      );
      return res.status(200).json(data);
    }
    return res.sendStatus(401);
  } catch (error) {
    return res.sendStatus(500);
  }
});

/**
 * @swagger
 * /user/{id}:
 *  put:
 *      summary: Update a user by id (Protected)
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: The user id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                     example:
 *                      userName: sampleName
 *                      email: sample@example.com
 *                      password: samplePassword
 *      responses:
 *          200:
 *              description: The user was updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref:   '#/components/schemas/User'
 *          403:
 *              description: Validation Error/ Username or email already used.
 *          400:
 *              description: Bad Request
 *
 */
router.put('/update-status', checkAuth, async (req, res) => {
  try {
    const ValidUser = validateInput(jobStatusUpdateSchema, req.body);
    if (!ValidUser.value) {
      return res.status(403).json(ValidUser);
    }

    const authUser = await User.findById(req.user.userId);
    const { status } = ValidUser.value;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(401).json('status not matched');
    }
    if (!['franchisor'].includes(authUser.role)) {
      // changed admin to companyAdmin
      ValidUser.value.id = req.user.userId;
      return res.status(401).json('User role is not matched');
    }

    await User.findByIdAndUpdate(ValidUser.value.id, { status });
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
