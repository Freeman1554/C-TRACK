import nodemailer from "nodemailer";
import config from "../config/index.js";
import {fileURLToPath} from "node:url";
import path from "node:path";
import ejs from "ejs";
import logger from "../utils/loggers.js"
//import sendOtp from "../controllers/authController.js";
//import { subscribe } from "node:diagnostics_channel";
import { text } from "node:stream/consumers";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//create a test account/replace with real credentials.

const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    secure: config.SMTP_SECURE === "true",
    auth:{
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export async function rendertemplate(templateName, payload = {}){
    const file = path.join(__dirname, "..", "template", "email", `${templateName}.ejs`);
    return ejs.renderFile(file, payload);
};

export async function sendPassworResetConfirmEmail(user){
    const html = await rendertemplate("password-reset-confirmation",{
        name: user.username,
        email: user.email,
        date: new Date().toLocaleString(),
        
    });
    const message = {
        from: `"Bankers Warehouse C-Track App <noreply@${config.SMTP_USER}>`,
        to: user.email,
        subject: "Reset password confirmation",
        html,
        text: `Hello ${user.username || "User"} Password reset successful`
    };
    try {
        await transporter.sendMail(message);
    } catch(error){
        console.log("Password reset failed", error);
        logger.error("Password reset failed", error)
    }
}

export async function sendPasswordUrlEmail (user, resetUrl) {
    const html = await rendertemplate("password-reset", {
        name: user.username,
        email: user.email,
        resetUrl,
        expiryTime: "15 minutes",
    });
    const message = {
        from: `"Bankers Warehouse C-Track App <noreply@${config.SMTP_USER}>`,
        to: user.email,
        subject: "Reset Password Notification",
        html,
        text: `Hello ${user.username || "User"}`
    };
    try {
        await transporter.sendMail(message);
    } catch(error){
        console.log("Error sending password reset link", error);
        logger.error("Error sending password reset link", error)
    }
}

export async function sendSigninEmail(user, meta = {}) {
    const html = await rendertemplate("login-notification",{
        name: user.username,
        loginTime: meta.loginTime || new Date().toLocaleString(),
        location: meta.location || "Unknown location",
        device: meta.device || "Unknown device",
    });
    const message ={
        from:`"Bankers Warehouse C-Track App" <${config.SMTP_USER}>`,
        to: user.email,
        subject: "Login Notification",
        html,
        text: `Hello ${user.username || "User"}, you logged in at ${new Date().toLocaleString()}`
    };
    try {
        await transporter.sendMail(message);
    } catch (error) {
        console.log("Error sending welcome email", error);
        logger.error("Error sending welcome email", error)
    }
}

export async function sendWelcomeEmail(user) {
    const html = await rendertemplate("welcome",{ 
        name: user.username,
        email: user.email,
    });
    const message = {
        from: `"Bankers Warehouse C-Track App" <${config.SMTP_USER}>`,
        to: user.email,
        subject: "welcome to Bankers Warehouse C-Track",
        html,
        text: `Hello ${user.username || "User"}, Congratulation, account created successfully`,
    };
    try {
        await transporter.sendMail(message);
    } catch (error) {
        console.log("Error sending welcome email", error);
        logger.error("Error sending welcome email", error)
    }
}

export async function sendOtp(to, subject, name, otp, expiryMins) {
    const html = await rendertemplate("otp", {name, otp, expiryMins});

    const message = {
        from: `"Bankers Warehouse C-Track App <noreply${process.env.SMTP_USER} >"`,
        to: user.email,
        subject: "Your OTP Code",
        html,
        text: `Hello ${name}, Your OTP is ${otp}. It expires in ${expiryMins} minutes`,
    };
    try{
        await transporter.sendMail(message);
    } catch(error){
        console.error("Error sending email:", error)
        logger.error("Error sending email:", error);
    }
}

// export async function sendMail(to, subject, html, text) {
//     const message = {
//         from: `"Bankers Warehouse C-Track  App <noreply@bankerswarehousectrack.com>"`,
//         to,
//         subject,
//         text,
//         html,
//     }
//     try{
//         const sending = await transporter.sendMail(message);
//     } catch(error){
//         console.error("Error sending email:", error)
//         logger.error("Error sending email:", error);
//     }
// };

export default {rendertemplate, sendOtp};