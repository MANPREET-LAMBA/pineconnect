const mongoose = require("mongoose")

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    billingCycle: { type: String, enum: ["monthly", "yearly"] },
    isFree: { type: Boolean, default: false },
    features: [{ type: String }],
    Accounts: { type: Number },
    isActive: { type: Boolean, default: true },
    isHighlighted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);