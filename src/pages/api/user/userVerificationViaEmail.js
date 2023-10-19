
import nodemailer from 'nodemailer';


const email = 'johnchiout.dev@gmail.com'
const pass = 'ypbytdbjwumhepop'


export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: pass
    }
})

export default async function handler(req, res) {
    const data = req.body
    try {
       
        const mail = {
            from: 'info@kolleris.com',
            to: ['info@kolleris.com' ,  `${process.env.NEXT_PUBLIC_NODEMAILER_EMAIL}`],
            text: "Ένας νέος χρήστης έχει ζητήσει να εγγραφεί στην ιστοσελίδα σας.",
            subject: 'Νέα Εγγραφή Χρήστη',
            html: data
        };
    
        transporter.sendMail(mail, (err, info) => {
            if (err) {
                console.log(err);
                emailSent = false
    
            } else {
                console.log('Email sent successfully!');
                emailSent = true
            }
        });
        return res.status(200).json({success: true, error: null})
    } catch (error) {
        console.log(error)
        return res.status(400).json({success: false, error: error})
    }
}