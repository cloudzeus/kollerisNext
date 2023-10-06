
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, 
    auth: {
        user: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
        pass: process.env.NEXT_PUBLIC_NODEMAILER_PASS
    },
    tls: {
        ciphers: 'SSLv3'
    }
});
export {transporter}