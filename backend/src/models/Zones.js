const mongoose = require('mongoose');

const { Schema } = mongoose;

const ZoneSchema = new Schema(
  {
    zoneName: String,
    zipCodes: [String],
    franchiseeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
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

module.exports = mongoose.model('Zones', ZoneSchema);
