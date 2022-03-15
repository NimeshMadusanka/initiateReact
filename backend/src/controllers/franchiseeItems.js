const express = require('express');
const mongoose = require('mongoose');

const {
  FranchiseeItemSchema,
} = require('../validations/FranchiseeItemValidation');
const FranchiseeItem = require('../models/FranchiseeItems');
const Item = require('../models/Item');
const checkAuth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();
const { validateInput } = require('../utils/common-functions');
const FranchiseeItemDisplay = require('../models/FranchiseeItemsDisplay');

/**
 * @swagger
 * /franchiseeItems:
 *  post:
 *      summary: Create new Service (Protected)
 *      tags: [FranchiseeItems]
 *      responses:
 *          200:
 *              description: Successfully created Franchisee Item
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items :
 *                              $ref:   '#/components/schemas/franchiseeItems'
 *          403:
 *              description: Validation Error
 *          400:
 *              description: Bad Request
 *
 */

router.post('/', checkAuth, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const AuthUserData = await User.findById(req.user.userId);

    if (!['franchisor', 'franchisee'].includes(AuthUserData.role)) {
      return res.sendStatus(401);
    }

    const validInput = validateInput(FranchiseeItemSchema, req.body);
    if (!validInput.value) {
      return res.status(403).json(validInput);
    }

    session.startTransaction();

    const { price, name, serviceType, id } = validInput.value;

    const count = await Item.findOne({ name: name }).session(session);

    const itemId = count.itemId;

    const newId = mongoose.Types.ObjectId(id);
    const find = await FranchiseeItem.findById(newId);

    if (find) {
      await FranchiseeItem.findByIdAndUpdate(id, { price });

      return res.sendStatus(200);
    }

    const newFranchiseeItem = new FranchiseeItem({
      price,
      serviceType,
      itemId: itemId,
      item: id,
      franchisee: AuthUserData.id,
    });

    await newFranchiseeItem.save();
    session.endSession();
    return res.sendStatus(200);
  } catch (error) {
    session.endSession();
    return res.sendStatus(500);
  }
});

router.post('/:id', checkAuth, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const AuthUserData = await User.findById(req.user.userId);

    if (!['franchisor'].includes(AuthUserData.role)) {
      return res.sendStatus(401);
    }

    const validInput = validateInput(FranchiseeItemSchema, req.body);
    if (!validInput.value) {
      return res.status(403).json(validInput);
    }

    session.startTransaction();

    const { price, name, serviceType, id } = validInput.value;

    const count = await Item.findOne({ name: name }).session(session);

    const itemId = count.itemId;

    const newId = mongoose.Types.ObjectId(id);
    const find = await FranchiseeItem.findById(newId);

    if (find) {
      await FranchiseeItem.findByIdAndUpdate(id, { price });

      return res.sendStatus(200);
    }

    const newFranchiseeItem = new FranchiseeItem({
      price,
      serviceType,
      itemId: itemId,
      item: id,
      franchisee: req.params.id,
    });

    await newFranchiseeItem.save();
    session.endSession();
    return res.sendStatus(200);
  } catch (error) {
    session.endSession();
    return res.sendStatus(500);
  }
});
router.get('/:serviceType', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    const service = req.params.serviceType;

    if (AuthUserData.role !== 'franchisee') {
      return res.sendStatus(401);
    }

    const FranchiseeItems = await FranchiseeItem.find({
      franchisee: AuthUserData.id,
      serviceType: service,
    }).populate('item');

    const itemIds = FranchiseeItems.map((ele) => ele.item);

    const newFranchisorItems = await Item.find({
      _id: { $nin: itemIds },
      serviceType: service,
      status: true,
    });

    const items = [...newFranchisorItems, ...FranchiseeItems];

    const foundItem = await FranchiseeItemDisplay.find({
      franchisee: AuthUserData.id,
    });

    const ticked = foundItem.map((item) => String(item.itemId));

    const newItems = items.map((e) => {
      let newItem = {
        id: e.id,
        itemId: e.itemId,
        franchisee: e.franchisee,
        name: e.name,
        price: e.price,
        item: e.item,
      };
      if (ticked.includes(e.id)) {
        newItem.displayInShop = true;
      } else {
        newItem.displayInShop = false;
      }

      return newItem;
    });

    return res.status(200).json(newItems);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/:serviceType/:id', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    const service = req.params.serviceType;

    if (AuthUserData.role !== 'franchisor') {
      return res.sendStatus(401);
    }

    const FranchiseeItems = await FranchiseeItem.find({
      franchisee: req.params.id,
      serviceType: service,
    }).populate('item');

    const itemIds = FranchiseeItems.map((ele) => ele.item);

    const newFranchisorItems = await Item.find({
      _id: { $nin: itemIds },
      serviceType: service,
    });

    const items = [...newFranchisorItems, ...FranchiseeItems];

    return res.status(200).json(items);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
