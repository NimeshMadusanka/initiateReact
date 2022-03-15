const express = require("express");

const router = express.Router();
const Counters = require("../models/Counters");
const Royalty = require("../models/Royalty");
const checkAuth = require("../middleware/auth");

// @route   GET api/counter
// @desc    Get all counters
// @access  Private
router.get("/", checkAuth, async (req, res) => {
  try {
    const counter = await Counters.find();
    res.status(200).json({
      id: counter[0].id,
      seq_value: counter[0].seq_value,
      item_value: counter[0].item_value,
    });
  } catch (err) {
    res.sendStatus(500);
  }
});

// @route   GET api/counter
// @desc    reset counter
// @access  Private
router.get(
  "/reset",
  /* checkAuth, */ async (req, res) => {
    try {
      await Counters.deleteMany({});
      await Royalty.deleteMany({});
      const counter = new Counters({
        seq_value: 1,
      });
      await counter.save();
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
    }
  }
);

module.exports = router;
