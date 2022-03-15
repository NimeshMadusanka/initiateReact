const mongoose = require("mongoose");

const { Schema } = mongoose;

const CustomerSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phoneNumber: String,
    location: [{
      apartmentNo: String,
      zipCode: String,
      address: String,
      nickName: String,
    }],
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

module.exports = mongoose.model("Customer", CustomerSchema);
