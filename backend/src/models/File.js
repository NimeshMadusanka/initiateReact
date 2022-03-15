const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;
const { Schema } = mongoose;

const FileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    Filetype: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    folder: {
      type: ObjectId,
      ref: "Folder",
    },
    owner: {
      type: ObjectId,
      ref: "User",
    },
    status: {
      type: Boolean,
      default: true,
    },
    share: {
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

module.exports = mongoose.model("File", FileSchema);
