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

module.exports = token_create;