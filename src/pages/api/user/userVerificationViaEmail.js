
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

export const mailOptions  = {
    from: email,
    to: email,
}

export default async function handler(req, res) {
    const data = req.body
    console.log('data', JSON.stringify(data))
    // console.log()
    try {
        await transporter.sendMail({
            ...mailOptions,
            subject: 'Νέα Εγγραφή Χρήστη',
            text: "Ένας νέος χρήστης έχει ζητήσει να εγγραφεί στην ιστοσελίδα σας.",
            html: data
        })
        return res.status(200).json({success: true, error: null})
    } catch (error) {
        console.log(error)
        return res.status(400).json({success: false, error: error})
    }
}