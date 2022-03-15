const mongoose = require('mongoose');

const { Schema } = mongoose;

const RoyaltySchemas = new Schema(
  {
    schemeID: {
      default: '',
      required: true,
      unique: true,
      type: String,
    },
    scheme_Name: {
      type: String,
      required: true,
    },

    royalty_Percentage: {
      type: Number,
      required: true,
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
  },
);

RoyaltySchemas.virtual('franchisee_List', {
  ref: 'User',
  localField: '_id',
  foreignField: 'royaltyScheme',
  justOne: false,
  options: {
    select:
      'firstName',
  },
});

module.exports = mongoose.model('Royalty', RoyaltySchemas);
