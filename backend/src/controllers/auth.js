const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Customer = require("../models/Customer");
const { getToken, verifyToken } = require("../utils/getToken");
const { validateInput } = require("../utils/common-functions");
const { sendMail } = require("../utils/common-functions");
const {
  UserSchema,
  LoginSchema,
  CustomerLoginSchema,
} = require("../validations/UserValidation");

const router = express.Router();
const checkAuth = require("../middleware/auth");
const { franchisor, franchisee } = require("../utils/routes");

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
 *  name : Auth
 *  description : The users authentication managing API
 */

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: Login
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                     example:
 *                      email: sample@example.com
 *                      password: samplePassword
 *      responses:
 *          200:
 *              description: The user is logged in successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref:   '#/components/schemas/User'
 *
 *          403:
 *              description: Validation Error
 *          400:
 *              description: Bad Request
 *
 */
router.post("/login", async (req, res) => {
  try {
    const checkValidation = validateInput(LoginSchema, req.body);
    if (!checkValidation.value) {
      return res.status(403).json("Please check your email and password");
    }
    const validUser = await User.findOne({
      email: checkValidation.value.email,
    });

    if (!validUser) {
      return res.sendStatus(401);
    }
    if (!validUser.status) {
      return res
        .status(503)
        .json("User status not set, please contact administrator");
    }
    if (validUser.email && validUser.status === "tempBlock") {
      return res
        .status(503)
        .json("You are temporary block, please contact administrator");
    }

    if (validUser.email && validUser.status === "pending") {
      return res
        .status(422)
        .json("You are status not active yet, please contact administrator");
    }
    if (validUser.email && validUser.status === "inactive") {
      return res
        .status(422)
        .json("You are status inactive yet, please contact administrator");
    }
    if (!validUser.password) {
      return res
        .status(422)
        .json("Your password is not set, please contact administrator");
    }
    // check Password
    const validPassword = await bcrypt.compare(
      checkValidation.value.password,
      validUser.password
    );
    if (!validPassword) {
      // Prevent login
      await User.updateOne(
        { email: validUser.email },
        {
          $inc: {
            totalFailedLoginAttempts: 1,
            continuesfailedLoginAttempts: 1,
          },
        }
      );

      return res.sendStatus(401);
    }

    // Create access JWT
    const accessToken = getToken(validUser.id, process.env.JWT_KEY, "24h");

    // create refresh JWT
    const refreshToken = getToken(validUser.id, process.env.REFRESH_KEY, "90d");

    // save this in db
    validUser.refreshTokens.push(refreshToken);

    // set last login date
    User.findOneAndUpdate({
      email: validUser.email,
      lastLoginDate: Date.now(),
      new: true,
    });

    await validUser.save();
    const data = {
      accessToken,
      refreshToken,
      fullName: validUser.fullName,
      role: validUser.role,
      ownerName: validUser.ownerName,
      id: validUser.id,
    };

    if (validUser.role === "franchisor") {
      data.permittedRoutes = franchisor;
    }

    if (validUser.role === "franchisee") {
      data.permittedRoutes = franchisee;
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.post("/customer-login", async (req, res) => {
  try {
    const checkValidation = validateInput(CustomerLoginSchema, req.body);
    if (!checkValidation.value) {
      return res.status(403).json("Invalid input");
    }
    const validUser = await Customer.findOne({
      email: checkValidation.value.email,
    });

    if (!validUser) {
      return res.status(403).json("Please check your email and password");
    }

    // check Password
    const validPassword = await bcrypt.compare(
      checkValidation.value.password,
      validUser.password
    );
    if (!validPassword) {
      return res.status(401).json("Please check your  password");
    }

    // Create access JWT
    const accessToken = getToken(validUser.id, process.env.JWT_KEY, "24h");

    // create refresh JWT
    // const refreshToken = getToken(validUser.id, process.env.REFRESH_KEY, "90d");

    // // save this in db
    // validUser.refreshTokens.push(refreshToken);

    // set last login date

    await validUser.save();
    const data = {
      accessToken,
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      id: validUser.id,
      location: validUser.location,
    };

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const ValidUserData = validateInput(validationEmailSchema, req.body);
    if (!ValidUserData.value) {
      return res.status(403).json(ValidUserData);
    }
    const { email } = ValidUserData.value;
    const validUser = await User.findOne({ email, status: "active" });

    if (!validUser) {
      return res.sendStatus(401);
    }
    const verifyTokens = verifyToken();

    const userData = {
      verificationTokenTimeStamp: verifyTokens.verificationTokenTimeStamp,
      verificationToken: verifyTokens.verificationToken,
    };
    await User.findByIdAndUpdate(validUser.id, userData);

    const isOpenEndpoint = false;

    const link = `${process.env.CLIENT_URL}/set-password/${email}/${verifyTokens.verificationToken}/${isOpenEndpoint}`;
    const templateData = {
      name: `${validUser.firstName} ${validUser.lastName}`,
      link,
    };
    sendMail(email, "d-55c6b0ca85654dcabf59e708df2c5dad", templateData);
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get("/me", checkAuth, async (req, res) => {
  try {
    const data = await User.findOne(
      { _id: req.user.userId, status: "active" },
      "title firstName lastName fullName role email"
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

// Account Activated by email
router.post("/verify-email", async (req, res) => {
  try {
    const ValidUser = validateInput(validationEmailSchema, req.body);
    if (!ValidUser.value) {
      return res.status(403).json(ValidUser);
    }
    const { verificationToken, email, isOpenEndpoint, password } =
      ValidUser.value;

    const user = await User.findOne({ email, verificationToken });

    if (!user) {
      return res.sendStatus(401);
    }
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    const timeDifference = currentTime - user.verificationTokenTimeStamp;
    const remindedTime = Math.floor(timeDifference / 1000 / 60 / 60);

    if (remindedTime > 12) {
      return res.sendStatus(408); // retested timeout
    }

    if (isOpenEndpoint) {
      const userData = {
        verificationTokenTimeStamp: null,
        verificationToken: null,
        status: "active",
      };
      await User.findByIdAndUpdate(user.id, userData);
      return res.sendStatus(200);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      verificationTokenTimeStamp: null,
      verificationToken: null,
      status: "active",
      password: hashedPassword,
    };
    await User.findByIdAndUpdate(user.id, userData);
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

// Create new access token using refresh token
router.post("/access-token", async (req, res) => {
  try {
    const rToken = req.body.token;

    if (!rToken) {
      // cloud not found way to find and access value from array
      return res.sendStatus(403);
    }

    const validUser = await jwt.verify(rToken, process.env.REFRESH_KEY);
    if (validUser) {
      // Create access JWT
      const accessToken = getToken(
        validUser.userId,
        process.env.JWT_KEY,
        "24h"
      );

      // delete the old refreshToken send new refresh token
      // delete old refresh token

      const userData = await User.findById(validUser.userId);
      userData.refreshTokens.pop();
      await userData.save();

      // create refresh JWT
      const refreshToken = getToken(
        userData.id,
        process.env.REFRESH_KEY,
        "90d"
      );

      // save this in db
      userData.refreshTokens.push(refreshToken);
      await userData.save();

      return res.status(201).json({
        accessToken,
        refreshToken,
      });
    }
    return res.sendStatus(401);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put("/change-password", checkAuth, async (req, res) => {
  try {
    const authUser = await Customer.findById(req.user.userId);

    if (!authUser) {
      return res.sendStatus(401);
    }
    const { email } = authUser;
    const { newPassword, currentPassword } = req.body;
    const validUser = await Customer.findOne({ email });

    if (!validUser) {
      return res.sendStatus(401);
    }
    const validPassword = await bcrypt.compare(
      currentPassword,
      validUser.password
    );

    if (!validPassword) {
      return res.sendStatus(403);
    }

    const salt = await bcrypt.genSalt(10);
    const NewPassword = await bcrypt.hash(newPassword, salt);

    await Customer.findByIdAndUpdate(validUser.id, { password: NewPassword });
    return res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});
module.exports = router;
