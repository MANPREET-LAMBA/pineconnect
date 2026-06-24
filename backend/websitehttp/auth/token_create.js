const JWT = require('jsonwebtoken');
function token_create(email,password){
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        email: email,
        password: password,
    }
    const token = JWT.sign(data, jwtSecretKey);
    console.log(token);
    return token;
    
}

const check = (tokenx) => {
  const token = tokenx;
  console.log(token);
  
  console.log("in check auth");

  if (!token) {
    console.log("token not found");

    return false;
  }

  try {
    // verify token
    console.log("in try");

    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
    console.log("decode " + decoded);
    return decoded

    // res.json({ success: true, user: decoded });
  } catch (err) {
    console.log("in auth ");
    
    console.log(err);

  
  }
}

module.exports = {token_create,check};