
import nodemailer from 'nodemailer';
const email = 'johnchiout.dev@gmail.com'
const pass = 'ypbytdbjwumhepop'


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: pass
    }
})


export {transporter, email}