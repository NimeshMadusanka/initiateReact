const mongoose = require("mongoose");

const { Schema } = mongoose;

const TimeSlotsSchema = new Schema(
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
    limit: {
      type: Number,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
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

TimeSlotsSchema.virtual("timeSlots").get(function () {
  const startTime = new Date(
    0,
    0,
    0,
    this.startTime.split(":")[0],
    this.startTime.split(":")[1]
  );
  const endTime = new Date(
    0,
    0,
    0,
    this.endTime.split(":")[0],
    this.endTime.split(":")[1]
  );
  return `${startTime.toLocaleTimeString([], {
    timeStyle: "short",
  })} - ${endTime.toLocaleTimeString([], { timeStyle: "short" })}`;
});

TimeSlotsSchema.virtual("zoneName", {
  ref: "Zones",
  localField: "zone",
  foreignField: "_id",
  justOne: false,
}).get(function () {
  return this.zone.zoneName;
});
module.exports = mongoose.model("TimeSlots", TimeSlotsSchema);
