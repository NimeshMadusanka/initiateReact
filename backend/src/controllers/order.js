const express = require('express');

const Order = require('../models/Order');
const checkAuth2 = require('../middleware/customer');
const router = express.Router();

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

router.post('/', checkAuth2, async (req, res) => {
  try {
    //   const checkValidation = validateInput(FolderSchema, req.body);
    //   if (!checkValidation.value) {
    //     return res.status(403).json('Please check your Folder Name');
    //   }
    const {
      orderType,
      zipCode,
      pickupDate,
      pickupTimeSlot,
      diliverDate,
      diliverTimeSlot,
      wPrice,
      servicePrice,
      specialCarePrice,
      processingFee,
      totalPrice,
      customer,
    } = req.body;

    const order = new Order({
      orderType,
      zipCode,
      pickupDate,
      pickupTimeSlot,
      diliverDate,
      diliverTimeSlot,
      wPrice,
      servicePrice,
      specialCarePrice,
      processingFee,
      totalPrice,
      customer,
    });
    await order.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
