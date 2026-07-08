const express = require("express")
const foregtApp=  express()
const Redis = require("../connect/redisCon")
const users = require("../schema/sign_schema")
const sentmail = require("../emial/emailConfig")
const bcrypt = require("bcrypt")
const saltRounds = 10;


foregtApp.post("/emailVerfication",async(req,res)=>{
    
    
    const {email} = req.body;
    console.log(email);
    

    const rediis = Redis()
    

    if(!email){
        res.status(400).json({message:"Email not found"})
    }

    try {
        const user = await users.findOne({email})
        const otp = Math.floor(100000+ Math.random()*900000).toString();

        await rediis.set(`opt${email}`,otp, "EX", 60*4 )
        sentmail(otp)

        res.status(200).json({message:"opt sent"})

    } catch (error) {
        console.log(error)
        
    }


})

foregtApp.post("/setPass",async(req,res)=>{

    const { email,otp, password } = req.body;
    const rediis = Redis()
     

    optCheck = await rediis.get(`opt${email}`)
    console.log(optCheck);

    if(!email){
            return res.status(400).json({message:"Email mismatch"})

    }
    

    if( otp !== optCheck){
       return res.status(400).json({message:"Enter valid otp"})
    }

    try {
        const pass = bcrypt.hashSync(password, saltRounds);
        await users.findOneAndUpdate({email:email},{password:pass})
    res.status(200).json({message:"Password change successfull"})
    } catch (error) {
        console.log(error);
        
          res.status(400).json({message:"server error",
          })
    }

    




})

module.exports = foregtApp