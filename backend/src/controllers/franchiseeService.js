const express = require('express');

const { serviceSchema } = require('../validations/ServiceValidation');
const FranchiseeService = require('../models/FranchiseeService');
const checkAuth = require('../middleware/auth');
const checkAuth2 = require('../middleware/customer');
const User = require('../models/User');
const Zones = require('../models/Zones');
const Service = require('../models/Sevices');
const router = express.Router();
const { validateInput } = require('../utils/common-functions');

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

router.post('/', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    req.body.requester = AuthUserData.id;

    if (AuthUserData.role !== 'franchisee') {
      return res.sendStatus(401);
    }

    const validInput = validateInput(serviceSchema, req.body);
    if (!validInput.value) {
      return res.status(403).json(validInput);
    }

    const { price, serviceId } = validInput.value;

    const find = await FranchiseeService.findOne({
      franchisee: req.user.userId,
    });

    if (find) {
      const filter = { franchisee: req.user.userId };
      const update = { price: req.body.price };
      await FranchiseeService.findOneAndUpdate(filter, update);

      return res.sendStatus(200);
    }

    const newService = new FranchiseeService({
      price,
      franchisee: AuthUserData.id,
      serviceId,
    });

    await newService.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.post('/wash', checkAuth2, async (req, res) => {
  try {
    const zone = await Zones.findOne({ zipCodes: req.body.zipCode });

    const filter = { franchisee: zone.franchiseeId };

    const service = await FranchiseeService.findOne(filter);
    return res.status(200).json(service);
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

router.get('/', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    const filter = { franchisee: AuthUserData.id };

    const service = await FranchiseeService.findOne(filter);
    return res.status(200).json(service);
  } catch (error) {
    return res.sendStatus(500);
  }
});

//edit franchisee
router.get('/:id', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.params.id);
    const filter = { franchisee: req.params.id };

    const service = await FranchiseeService.findOne(filter);

    return res.status(200).json(service);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
