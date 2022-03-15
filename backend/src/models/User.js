const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    fID: String,
    title: {
      type: String,
      enum: ['Ms', 'Mrs', 'Mr', 'Dr'],
      default: 'Mr',
    },
    firstName: String,
    suitNo: String,
    lastName: String,
    email: String,
    password: String,
    vehicleNo: String,
    phoneNumber: String,
    description: String,
    ownerName: String,
    address: String,
    status: {
      type: String,
      enum: ['active', 'pending', 'inactive', 'tempBlock'],
      default: 'active',
    },
    serviceRegions: [String],
    note: String,
    pricing: {
      serviceOne: Number,
      serviceTwo: Number,
      serviceThree: Number,
    },
    royaltyScheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Royalty',
    },
    permission: {
      enum: {
        Folder: [String],
        subFolder: [String],
        File: [String],
      },
    },

    role: {
      type: String,
      enum: ['franchisee', 'franchisor'],
      default: 'franchisee',
    },
    share: {
      type: Boolean,
      default: false,
    },
    refreshTokens: [String],
    continuesfailedLoginAttempts: Number,
    totalFailedLoginAttempts: { type: Number, default: 0 },
    verificationToken: String,
    verificationTokenTimeStamp: { type: Number, default: 0 },
    lastLoginDate: Date,

    // Requirement not complete from client

    // paymentType : {
    //   type: Schema.ObjectId,
    //   ref: 'User',
    // },
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

function getFullName() {
  return `${this.title} ${this.firstName} ${
    this.lastName ? this.lastName : ''
  }`;
}

function convertDate() {
  return moment(this.createdAt).format('YYYY-MM-DD hh:mm:ss A');
}

UserSchema.virtual('fullName').get(getFullName);

UserSchema.virtual('joined').get(convertDate);

module.exports = mongoose.model('User', UserSchema);
