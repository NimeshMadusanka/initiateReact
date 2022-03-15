const mongoose = require("mongoose");

const { Schema } = mongoose;

const FranchiseeServiceSchema = new Schema(
  {
    price: {
      type: Number,
      required: true,
    },

    serviceId: {
      type: Schema.ObjectId,
      ref: "Service",
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

module.exports = mongoose.model("FranchiseeService", FranchiseeServiceSchema);
