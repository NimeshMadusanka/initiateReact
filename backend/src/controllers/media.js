const express = require('express');
const multer = require('multer');
const uploadMediaFile = require('../../services/firebase');

const router = express.Router();

const Multer = multer({
  storage: multer.memoryStorage(),
  limits: 1024 * 1024,
});

router.post(
  '/',
  Multer.array('image', 5),
  uploadMediaFile,
  async (req, res) => {
    try {
      return res.sendStatus(200);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
);

module.exports = router;
