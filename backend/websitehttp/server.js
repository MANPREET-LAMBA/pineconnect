
const express = require('express');
const connect = require('./connect/db_connect')
const dotenv = require('dotenv');
const router = require("./auth/authx")
const licenseRoutes = require("./route/portal");

const cors = require('cors')
const cookieParser = require("cookie-parser");
const paymentroute = require('./route/paymentRoute');



const app = express();
app.use(cors({
  origin: [
   "https://pineconnect-bxwv.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dotenv.config();

app.use("/api", router)
app.use("/payment",paymentroute)
app.use("/api/licenses", licenseRoutes);
 // ✅ REQUIRED

connect();

app.get('/', (req, res) => {

  res.send("srver is live");
});



module.exports = app;
