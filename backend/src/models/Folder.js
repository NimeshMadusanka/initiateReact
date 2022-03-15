const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;
const { Schema } = mongoose;

const FolderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    parentId: {
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

module.exports = mongoose.model("Folder", FolderSchema);
