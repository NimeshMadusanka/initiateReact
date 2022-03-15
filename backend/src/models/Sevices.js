const mongoose = require("mongoose");

const { Schema } = mongoose;

const ServiceSchema = new Schema(
  {
    price: {
      type: Number,
      required: true,
    },

    name: {
      type: String,
      default: "Wash/Dry/Fold",
      unique: true,
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

module.exports = mongoose.model("Service", ServiceSchema);
