
import { transporter } from "./nodemailerConfig";


export const sendEmail = (email ,cc, subject, message, fileName, file) => {
    
    const mail = {
        from: process.env.NODEMAILER_USER,
        to: email,
        cc: cc,
        subject: subject,
        text: message,
    };
    if(fileName && file) {
        mail.attachments = [{
            filename: `${fileName}.xlsx`,
            content: file
        }]
    }

    return new Promise((resolve, reject) => {
      transporter.sendMail(mail, (err, info) => {
          if (err) {
              resolve({
                  status: false,
                  message: err.message
              }); // Resolve with an object containing status false and the error message
          } else {
              resolve({
                  status: true,
                  message: 'Email sent successfully'
              }); // Resolve with an object containing status true and a success message
          }
        
      });
  });
  }
