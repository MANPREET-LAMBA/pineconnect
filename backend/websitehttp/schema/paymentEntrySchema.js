const mongoose = require("mongoose");

const paymentEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    planName: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      uppercase: true,
      default: "INR",
    },

    paymentGateway: {
      type: String,
      enum: ["razorpay"],
      required: true,
    },

    razorpay: {
      orderId: {
        type: String,
        required: true,
        index: true,
      },
      paymentId: {
        type: String,
        required: false,
        index: true,
      },
      signature: {
        type: String,
        required: false,
      },
    },

    paymentStatus: {
      type: String,
      enum: ["created", "pending", "paid", "failed", "refunded"],
      default: "created",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("paymentEntrySchema", paymentEntrySchema);