const express = require("express");

const { serviceSchema } = require("../validations/ServiceValidation");
const Service = require("../models/Sevices");
const checkAuth = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();
const { validateInput } = require("../utils/common-functions");

/**
 * @swagger
 * /seivice:
 *  post:
 *      summary: Create new Service (Protected)
 *      tags: [Services]
 *      responses:
 *          200:
 *              description: Successfully created service
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items :
 *                              $ref:   '#/components/schemas/Service'
 *          403:
 *              description: Validation Error
 *          400:
 *              description: Bad Request
 *
 */

router.post("/", checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    req.body.requester = AuthUserData.id;

    if (AuthUserData.role !== "franchisor") {
      return res.sendStatus(401);
    }

    const validInput = validateInput(serviceSchema, req.body);
    if (!validInput.value) {
      return res.status(403).json(validInput);
    }

    const { price } = validInput.value;

    const find = await Service.findOne({ name: "Wash/Dry/Fold" });

    if (find) {
      const update = { price: req.body.price };
      const filter = { name: "Wash/Dry/Fold" };
      await Service.findOneAndUpdate(filter, update);

      return res.sendStatus(200);
    }

    const newService = new Service({
      price,
    });

    await newService.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

/**
 * @swagger
 * /service:
 *  get:
 *      summary: get service (Protected)
 *      tags: [Requests]
 *      responses:
 *          200:
 *              description: Successfully created request
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items :
 *                              $ref:   '#/components/schemas/Service'
 *          403:
 *              description: Validation Error
 *          400:
 *              description: Bad Request
 *
 */

router.get("/", checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    if (!["franchisor", "franchisee"].includes(AuthUserData.role)) {
      return res.sendStatus(401);
    }

    const data = await Service.findOne({ name: "Wash/Dry/Fold" }).populate(
      "franchisor"
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

/**
 * @swagger
 * /service/{id}:
 *  put:
 *      summary: Update a user by id (Protected)
 *      tags: [Services]
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
 *                          $ref:   '#/components/schemas/Service'
 *          403:
 *              description: Validation Error/ Username or email already used.
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

    await Service.findByIdAndUpdate(id, { status });
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
