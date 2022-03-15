const mongoose = require("mongoose");

const { Schema } = mongoose;

const FranchiseeItemsDisplay = new Schema(
  {
    itemId: {
      type: Schema.ObjectId,
      ref: "FranchiseeItem",
    },

    franchisee: {
      type: Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model(
  "FranchiseeItemsDisplay",
  FranchiseeItemsDisplay
);
