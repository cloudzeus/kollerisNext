
import { transporter } from '@/utils/nodemailerConfig';


export default async function handler(req, res) {
    const data = req.body;
    try {
        const mail = {
            from: process.env.NODEMAILER_USER,
            to: ['giannis.chiout@gmail.com'],
            cc: '',
            text: "Ένας νέος χρήστης έχει ζητήσει να εγγραφεί στην ιστοσελίδα σας.",
            subject: 'Νέα Εγγραφή Χρήστη',
            html: data
        };
        

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
    } catch (error) {
        return res.status(400).json({success: false, error: error})
    }
}