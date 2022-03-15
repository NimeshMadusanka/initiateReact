const mongoose = require("mongoose");

const { Schema } = mongoose;

const FranchiseeItemSchema = new Schema(
  {
    name: String,
    price: {
      type: Number,
      required: true,
    },
    itemId: String,

    item: {
      type: Schema.ObjectId,
      ref: "Item",
    },
    franchisee: {
      type: Schema.ObjectId,
      ref: "User",
    },

    displayInShop: {
      type: Boolean,
      default: false,
    },

    serviceType: {
      type: String,
      enum: ["dryCleaning", "tailoring"],
    },

    status: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("FranchiseeItem", FranchiseeItemSchema);
