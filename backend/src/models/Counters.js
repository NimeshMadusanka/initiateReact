const mongoose = require("mongoose");

const { Schema } = mongoose;

const CounterSchemas = new Schema(
    {
        seq_value: {
            default: 00001,
            type: Number,
            unique: true,
        },
        item_value: {
            default: 00001,
            type: Number,
            unique: true,
        },
        tailoring_item_value: {
            default: 00001,
            type: Number,
            unique: true,
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

module.exports = mongoose.model("Counter", CounterSchemas);