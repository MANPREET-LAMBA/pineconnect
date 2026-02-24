const express = require("express");
const cookieParser = require("cookie-parser");
const userModel = require("../schema/sign_schema");
const router = express();
router.use(cookieParser()); // ✅ REQUIRED
const jwt = require('jsonwebtoken');

const bcrypt = require("bcrypt");
const sendmail = require("../emial/emailConfig");
const token_create = require("./token_create");
const saltRounds = 10;

router.use(express.json());
router.post("/newuser", async (req, res) => {
  const { fullName, email, country, phone, password } = req.body;
  const pass = bcrypt.hashSync(password, saltRounds);
    const result = await userModel.create({
      fullName: fullName,
      email: email,
      country: country,
      phone: phone,
      password: pass,
    });

  await sendmail();
  const token = token_create(email, password);
  console.log("tokens " + token);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // ✅ SEND RESPONSE
  res.status(201).json({
    message: "User created successfully",
  });
});

router.get("/checkauth", (req, res) => {
  const token = req.cookies.token;
  console.log("in check auth");
  

  if (!token) {
    console.log("token not found");
    
    return res.status(401).json({ success: false });
  }

  try {
    // verify token
    console.log("in try");
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);
    
    res.json({ success: true, user: decoded });
  } catch (err) {
    console.log(err);
    
    res.status(401).json({ success: false });
  }
});
module.exports = router;
