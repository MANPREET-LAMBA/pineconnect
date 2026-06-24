const express = require("express");
const cookieParser = require("cookie-parser");
const userModel = require("../schema/sign_schema");
const router = express();
router.use(cookieParser()); // ✅ REQUIRED
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendmail = require("../emial/emailConfig");
const {token_create} = require("./token_create");
const lic = require("../schema/licenseSchema")
const saltRounds = 10;

const dotenv = require("dotenv");
dotenv.config();

const cookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

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

  // await sendmail();
  const token = token_create(email, password);
  console.log("tokens " + token);

  res.cookie("token", token, cookieOptions);

  // ✅ SEND RESPONSE
  res.status(201).json({
    message: "User created successfully",
  });
});

router.get("/checkauth", (req, res) => {
  console.log(req.cookies);
  const token = req.cookies.token;
  console.log(token);
  console.log("in check auth");

  if (!token) {
    console.log("token not found");

    return res.status(401).json({ success: false });
  }

  try {
    // verify token
    // console.log("in try");

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decoded);

    res.json({ success: true, user: decoded });
  } catch (err) {
    console.log(err);

    res.status(401).json({ success: false });
  }
});

router.post("/logout", (req, res) => {
  console.log("in logout", req.cookies);
  res.clearCookie("token", {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
    expires: new Date(0),
    maxAge: 0,
  });
  res.cookie("token", "", {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
    maxAge: 0,
  });
  res.status(200).json({ message: "Logged out" });
});

router.post("/login", async (req, res) => {
  try {
    console.log("in login");

    const { email, password } = req.body;
    console.log(email, password);

    // 1️⃣ Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log(user);

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Create token
    const token = token_create(email, password);

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
});

// router.get("/getLicense",(req,res)=>{
// try {
//   console.log("heli");
  
//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbnByZWV0c2luZ2gyMDAzMUBnbWFpbC5jb20iLCJwYXNzd29yZCI6Ik1hbnByZWV0MSMiLCJpYXQiOjE3NzMwNzMwOTd9.MvIHyl2D0mWzV6up4HhT3UXI_5-buoPXnaFxc-m8Q6Y";
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   console.log("heli2");
//  console.log(decoded);
//   // const res = lic.find

//    res.status(500).json({ message: "Server error" });


// } catch (error) {
  
// }
// })

router.get("/getLicense", async (req,res)=>{
 try {

  console.log("heli");

  const token = req.cookies.token;
  console.log(token);
  

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  console.log("heli2");

  console.log(decoded.email);
const user = await userModel.findOne({email: decoded.email})



  const license = await lic.find({ user: user._id });
  console.log(license);
  

  res.status(200).json(license);

 } catch (error) {

  console.log(error);

  res.status(500).json({ message: "Server error" });

 }
});
module.exports = router;
