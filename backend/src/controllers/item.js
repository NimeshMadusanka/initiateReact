const express = require("express");

const { itemSchema } = require("../validations/ItemValidation");
const Item = require("../models/Item");
const checkAuth = require("../middleware/auth");
const User = require("../models/User");
const Counter = require("../models/Counters");
const router = express.Router();
const { validateInput } = require("../utils/common-functions");
const mongoose = require("mongoose");

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
  const session = await mongoose.startSession();
  try {
    const AuthUserData = await User.findById(req.user.userId);

    if (AuthUserData.role !== "franchisor") {
      return res.sendStatus(401);
    }

    const validInput = validateInput(itemSchema, req.body);
    if (!validInput.value) {
      return res.status(403).json("Invalid Input");
    }

    const { price, name, serviceType, id } = validInput.value;

    const foundItem = await Item.findOne({
      name: new RegExp(`^${name}$`, "i"),
      _id: { $ne: mongoose.Types.ObjectId(id) },
      serviceType: serviceType,
    });

    if (foundItem) {
      return res.status(403).json({message:"Item already exists"});
    }

    session.startTransaction();

    const itemIds = await Counter.find().session(session);

    let itemId;

    if (serviceType === "dryCleaning") {
      itemId = "DR" + itemIds[0].item_value;
    }

    if (serviceType === "tailoring") {
      itemId = "TA" + itemIds[0].tailoring_item_value;
    }

    const find = await Item.findOne({
      serviceType: serviceType,
      _id: id,
    }).session(session);

    if (find) {
      const update = { price: req.body.price, name: req.body.name };
      await Item.findByIdAndUpdate(id, update);

      return res.sendStatus(200);
    }

    const newItem = new Item({
      price,
      name,
      serviceType,
      itemId: itemId,
    });

    await newItem.save({ session });

    if (serviceType === "dryCleaning") {
      await Counter.findByIdAndUpdate(
        itemIds[0]._id,
        {
          $inc: {
            item_value: 1,
          },
        },
        { new: true, session }
      );
    }

    if (serviceType === "tailoring") {
      await Counter.findByIdAndUpdate(
        itemIds[0]._id,
        {
          $inc: {
            tailoring_item_value: 1,
          },
        },
        { new: true, session }
      );
    }

    // end session
    // finish transcation
    await session.commitTransaction();
    session.endSession();
    return res.sendStatus(200);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.sendStatus(500);
  }
});

router.get("/:serviceType", checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    const service = req.params.serviceType;

    if (!["franchisor", "franchisee"].includes(AuthUserData.role)) {
      return res.sendStatus(401);
    }

    const data = await Item.find({ serviceType: service });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put("/update-status", checkAuth, async (req, res) => {
  try {
    const authUser = await User.findById(req.user.userId);

    if (authUser.role !== "franchisor") {
      return res.sendStatus(401);
    }

    const { id, status } = req.body;

    await Item.findByIdAndUpdate(id, { status });
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
