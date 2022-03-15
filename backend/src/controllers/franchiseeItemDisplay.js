const express = require("express");
const router = express.Router();

const FranchiseeItemDisplay = require("../models/FranchiseeItemsDisplay");
const checkAuth = require("../middleware/auth");
const User = require("../models/User");

/**
 * @swagger
 * /franchiseeItemDisplay:
 *  post:
 *      summary: Create new request (Protected)
 *      tags: [FranchiseeItemDisplay]
 *      responses:
 *          200:
 *              description: Successfully created request
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items :
 *                              $ref:   '#/components/schemas/FranchiseeItemDisplay'
 *          403:
 *              description: Validation Error
 *          400:
 *              description: Bad Request
 *
 */

router.post(
  "/",
  checkAuth,

  async (req, res) => {
    try {
      const AuthUserData = await User.findById(req.user.userId);

      const { itemId } = req.body;

      const find = await FranchiseeItemDisplay.findOne({
        franchisee: AuthUserData.id,
        itemId: itemId,
      });

      if (find) {
        await FranchiseeItemDisplay.deleteOne({
          franchisee: AuthUserData.id,
          itemId: itemId,
        });

        return res.sendStatus(200);
      }

      const newItem = new FranchiseeItemDisplay({
        itemId,
        franchisee: AuthUserData.id,
      });

      await newItem.save();
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
);

module.exports = router;
