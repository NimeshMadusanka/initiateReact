const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    orderType: String,
    zipCode: String,
    pickupDate: String,
    pickupTimeSlot: String,
    diliverDate: String,
    diliverTimeSlot: String,
    wPrice: Number,
    servicePrice: Number,
    specialCarePrice: Number,
    processingFee: Number,
    totalPrice: Number,
    customer: {
      type: Schema.ObjectId,
      ref: 'Customer',
    },
    status: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model('Order', OrderSchema);
