const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: "manpreetsingh20031@gmail.com",
    pass: "pmmk cdzs vwnj gaol",
  },
}); 

// Send an email using async/await
const sendmail = async ()=>{
    
  const info = await transporter.sendMail({
    
    to: "simmu242003@gmail.com",
    subject: "Hello ✔",
    text: "Hello world?", // Plain-text version of the message
    html: "<b>Hello world?</b>", // HTML version of the message
    
})
console.log("Message sent:", info.messageId);
}

module.exports = sendmail;