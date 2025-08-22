const nodemailer = require("nodemailer");
require("dotenv").config();
const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.host,
            //port: 587,
            //  secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.user,
                pass: process.env.pass,
            },

        });

        const info = await transporter.sendMail({
            from: "EdTech->Rituranjan Kumar",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        });
        console.log("otpInfo->", info);
    }
    catch (error) {
        console.log(error.message);
    }
}

module.exports = mailSender;