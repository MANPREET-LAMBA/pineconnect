
const express = require('express');
const connect = require('./connect/db_connect')
const dotenv = require('dotenv');
const router = require("./auth/authx")
var cors = require('cors')
const cookieParser = require("cookie-parser");
const paymentroute = require('./route/paymentRoute');

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // frontend
  credentials: true
}));
app.use(express.json());
dotenv.config();

app.use("/api", router)
app.use("/payment",paymentroute)
app.use(cookieParser()); // ✅ REQUIRED

connect();

app.get('/', (req, res) => {

  res.send("srver is live");
});

// app.get("/subscription", (req, res) => {
//   const plans = [
//     {
//       name: "Basic",
//       price: "Free",
//       features: [
//         "Limited Access",
//         "Basic Signals",
//         "Community Support",
//       ],
//     },
//     {
//       name: "Pro",
//       price: "$29 / month",
//       features: [
//         "Live Market Signals",
//         "Auto Trading",
//         "Priority Support",
//         "Risk Management",
//       ],
//       highlight: true,
//     },
//     {
//       name: "Premium",
//       price: "$79 / month",
//       features: [
//         "Everything in Pro",
//         "Unlimited Trades",
//         "API Access",
//         "1-on-1 Support",
//       ],
//     },
//   ];


//   res.send(plans)
// })

module.exports = app;
// app.listen(3000, () => {
//   console.log("HTTP Server on 3000");
// });
