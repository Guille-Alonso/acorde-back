const nodemailer = require("nodemailer");
const dotenv = require('dotenv');

dotenv.config();

 const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user: process.env.USER_AUTH,
        pass: process.env.PASS_AUTH,
    }
})

module.exports={transporter}