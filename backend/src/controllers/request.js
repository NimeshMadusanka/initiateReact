const express = require("express");
const router = express.Router();
const multer = require("multer");

const { requestSchema } = require("../validations/RequestValidation");
const Request = require("../models/Request");
const checkAuth = require("../middleware/auth");
const User = require("../models/User");
const { validateInput } = require("../utils/common-functions");
const uploadMedia = require("../../services/firebase");

const Multer = multer({
  storage: multer.memoryStorage(),
  limits: 1024 * 1024,
});

/**
 * @swagger
 * components:
 *   schemas:
 *      Request:
 *       type: object
 *       required:
 *
 *       properties:
 *            subject:
 *               type:string
 *               description: subject of request
 *             franchiseeName:
 *               type:string
 *               description: Franchisee Name
 *             franchiseOwnerName:
 *               type:string
 *               description: Franchise Owner Name
 *             email:
 *               type:string
 *               description: corresponding email address
 *             zipCode:
 *               type:string
 *               description: Zip Code
 *             description:
 *               type:string
 *               description: Description
 *             from:
 *               type:string
 *               description: From (Date)
 *             to:
 *               type:string
 *               description: To (Date)
 *
 *      example:
 *          subject : sampleSubject
 *          franchiseeName : sampleName
 *          franchiseOwnerName : sampleName
 *          email : sample@example.com
 *          zipCode : sampleCode
 *          description : sampleDescription
 *          from: DD/MM/YYYY
 *          to: DD/MM/YYYY
 *          status:approve
 *
 */

/**
 * @swagger
 * tags :
 *  name : Request
 *  description : The Request managing API
 *
 *
 */

/**
 * @swagger
 * /request:
 *  post:
 *      summary: Create new request (Protected)
 *      tags: [Requests]
 *      responses:
 *          200:
 *              description: Successfully created request
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items :
 *                              $ref:   '#/components/schemas/Request'
 *          403:
 *              description: Validation Error
 *          400:
 *              description: Bad Request
 *
 */

router.post(
  "/",
  checkAuth,
  Multer.array("image", 5),
  uploadMedia,
  async (req, res) => {
    try {
      const AuthUserData = await User.findById(req.user.userId);

      req.body.requester = AuthUserData.id;

      if (AuthUserData.role !== "franchisee") {
        return res.sendStatus(401);
      }

      const count = await Request.find().count();

      const requestId = "REQ" + count;

      const validInput = validateInput(requestSchema, req.body);
      if (!validInput.value) {
        return res.status(403).json(validInput);
      }

      const { subject, requester, email, zipCode, description, from, to } =
        validInput.value;

      const newRequest = new Request({
        subject,
        requester,
        email,
        zipCode,
        description,
        from,
        to,
        requestId: requestId,
        resuorces: req.media,
      });

      await newRequest.save();
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
);

router.get("/franchisee/:status", checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);
    const status = req.params.status;

    if (AuthUserData.role !== "franchisee") {
      return res.sendStatus(401);
    }

    const data = await Request.find({
      requester: AuthUserData.id,
      status: status,
    }).populate("requester");

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

/**
 * @swagger
 * /request:
 *  get:
 *      summary: Create new request (Protected)
 *      tags: [Requests]
 *      responses:
 *          200:
 *              description: Successfully created request
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items :
 *                              $ref:   '#/components/schemas/Request'
 *          403:
 *              description: Validation Error
 *          400:
 *              description: Bad Request
 *
 */

router.get("/", checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    if (AuthUserData.role !== "franchisor") {
      return res.sendStatus(401);
    }

    const data = await Request.find().populate("requester");

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

/**
 * @swagger
 * /request/{id}:
 *  put:
 *      summary: Update a request by id (Protected)
 *      tags: [Requests]
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
 *                      id: 61e524a20dc6513b5c231643
 *                      status: approved
 *
 *      responses:
 *          200:
 *              description: The request was updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref:   '#/components/schemas/Request'
 *
 *          400:
 *              description: Bad Request
 *
 */

router.put("/update-status", checkAuth, async (req, res) => {
  try {
    const authUser = await User.findById(req.user.userId);

    if (authUser.role !== "franchisor") {
      return res.sendStatus(401);
    }

    const { id, status } = req.body;

    await Request.findByIdAndUpdate(id, { status: status });
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
