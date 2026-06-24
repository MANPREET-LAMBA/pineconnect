const mongoose = require("mongoose");

const licenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    plan: {
      type: String,
      required: true,
      trim: true
    },

    licenseKey: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true
    },

    licenseName: {
      type: String,
      required: true,
      trim: true
    },

    mode: {
      type: String,
      enum: ["ON", "OFF"],
      default: "ON"
    },

    paymentId: {
      type: String,
      required: true,
      index: true
    },

    orderId: {
      type: String,
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["active", "expired", "revoked"],
      default: "active",
      index: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("License", licenseSchema);