const express = require('express');
const Zones = require('../models/Zones');
const checkAuth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.post('/', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    if (AuthUserData.role !== 'franchisee') {
      return res.sendStatus(401);
    }

    const { zoneName, zipCodes } = req.body;

    const newZone = new Zones({
      zoneName,
      zipCodes,
      franchiseeId: AuthUserData.id,
    });
    await newZone.save();

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId);

    if (!['franchisee'].includes(AuthUserData.role)) {
      return res.sendStatus(401);
    }

    const data = await Zones.find({franchiseeId: AuthUserData.id});

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
