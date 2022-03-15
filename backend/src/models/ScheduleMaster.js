const mongoose = require("mongoose");

const { Schema } = mongoose;

const ScheduleMasterSchema = new Schema(
  {
    franchiseeID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    zone: {
      type: Schema.Types.ObjectId,
      ref: "Zones",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    endDate: {
      // optional
      type: Date,
      default: null,
    },
    unattendedLimit: {
      type: Number,
      required: true,
    },
    unattendedCount: {
      type: Number,
      default: 0,
    },
    timeSlots: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "TimeSlots",
        },
        limit: {
          type: Number,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
    isPublished: {
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

module.exports = mongoose.model("ScheduleMaster", ScheduleMasterSchema);
