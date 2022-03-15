const mongoose = require("mongoose");

const { Schema } = mongoose;

const ItemSchema = new Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    itemId: String,

    name: {
      type: String,
    },

    franchisor: {
      type: Schema.ObjectId,
      ref: "User",
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

module.exports = mongoose.model("Item", ItemSchema);
