const express = require("express");
const planSchema = require("../schema/planSchema.js");
const crypto = require("crypto");
const razorpay = require("../subscription/rozpay.js");
const PaymentEntry = require("../schema/paymentEntrySchema.js");
const { check } = require("../auth/token_create.js");
const paymentroute = express.Router();
const userSchema = require("../schema/sign_schema.js");
const cookieParser = require("cookie-parser");
const createOrUpdateLicenses = require("../subscription/generateLicenseKey.js")
paymentroute.use(cookieParser());

// GET all active subscription plans
paymentroute.get("/subscription", async (req, res) => {
  console.log("helo");

  try {
    const plans = await planSchema.find({ isActive: true });

    res.status(200).json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

paymentroute.post("/createOrder", async (req, res) => {
  try {
    const { planId } = req.body;
    const token = req.cookies.token;

   
    const decoded = check(token); 
    // console.log("Token decoded:", decoded);

    // ✅ FIX 2: Ensure you are searching by email correctly
    // If 'decoded' contains an email, use { email: decoded.email }
    const result = await userSchema.findOne({ email: decoded.email });

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    const plan = await planSchema.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const amount = plan.price * 100;

    const options = {
      amount: amount,
      currency: plan.currency || "INR",
      receipt: `receipt_${plan._id}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // ✅ FIX 3: Satisfy your "User is required" Schema error
    const newPaymentEntry = new PaymentEntry({
      user: result._id,        // Make sure the field name matches your Schema ('user' vs 'userId')
      planName: plan.name,     // Added because your previous error said this was required
      paymentGateway: "razorpay", // Added because your previous error said this was required
      amount: plan.price,
      currency: plan.currency || "INR",
      paymentStatus: "pending",
      isActive: false,
      razorpay: {
        orderId: order.id      // Nesting it correctly for your Schema
      }
    });

    const savedEntry = await newPaymentEntry.save();

    // Now res.json will work because we didn't overwrite 'res'!
    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      paymentEntryId: savedEntry._id // You NEED to send this for the verify step
    });

  } catch (error) {
    console.error(error);
    // Be careful here too: ensure 'res' hasn't been overwritten in the catch block scope
    if (!res.status) {
        console.error("Critical: 'res' object was lost!");
        return;
    }
    res.status(500).json({ message: "Server error" });
  }
});

paymentroute.post("/verifyPayment", async (req, res) => {

 console.log("VERIFY BODY:", req.body);
console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET EXISTS:", !!process.env.RAZORPAY_KEY_SECRET);
  
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentEntryId,
    } = req.body;

    console.log("VERIFY BODY:", req.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentEntryId) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }

    const payment = await PaymentEntry.findById(paymentEntryId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment entry not found",
      });
    }

    payment.paymentStatus = "paid";
    payment.isActive = true;
    payment.startDate = new Date();
    payment.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    payment.razorpay = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    };

    await payment.save();

    await createOrUpdateLicenses(
      payment.user,
      payment.planName,
      razorpay_order_id,
      razorpay_payment_id
    );

    return res.json({ success: true });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
});


paymentroute.get("/test", (req, res) => {
  res.send("payment route is live");
})
module.exports = paymentroute;
