
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true for TLS, false for STARTTLS
    auth: {
      user: 'administrators@kolleris.com',
      pass: 'Mavromixali@1f1femsk@',
    },
  });



  

export {transporter}