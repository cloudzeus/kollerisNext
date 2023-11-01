
import { transporter } from "./nodemailerConfig";
import createCSV from "./createCSVfile";

export const sendEmail = (email,cc, subject, message, fileName, file, includeFile) => {
    console.log(email)
    const mail = {
        from: 'info@kolleris.com',
        to: email,
        cc: cc,
        subject: subject,
        text: message,
        attachments: [],
    };
    
    if(includeFile) {
        mail.attachments.push({
            filename: `${fileName}.xlsx`,
            content: file
        })
    }

    return new Promise((resolve, reject) => {
      transporter.sendMail(mail, (err, info) => {
        if (err) {
          console.log(err);
          resolve(false); // Resolve with false if there's an error
        } else {
          console.log('Email sent successfully!');
          resolve(true); // Resolve with true if the email is sent successfully
        }
      });
    });
  }
