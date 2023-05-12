import User from '../../../../server/models/userModel';
import connectMongo from '../../../../server/config';
import nodemailer from 'nodemailer';

const email = 'johnchiout.dev@gmail.com'
const pass = 'ypbytdbjwumhepop'
const baseURL = 'http://localhost:3000'


export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: pass
    }
})


 

const emailTemplate = (user) =>  `
    <p>Γειά σου, <strong>${user.firstName}</strong></p>
    <p>Η εγγραφή σου ολοκληρώθηκε μπορείς να πατήσεις τον παρακάτω σύνδεσμο για να συνδεθείς</p>
    <a href="${baseURL}/auth/signin">Σύνδεση</a>
`


export default async function handler(req, res) {
    const postId = req.query.id;
    console.log(req.query)


    try {
        await connectMongo();
        await User.updateOne({ _id: postId }, { role: 'employee' });
        const user = await User.findOne({ _id: postId });
        console.log('user create and found ', JSON.stringify(user))


        if (user && user.role === 'employee') {
            const mailOptions = {
                from: email,
                to: user.email,
            }

            await transporter.sendMail({
                ...mailOptions,
                subject: `Επιβεβαίωση Εγγραφής`,
                text: "Mπορείτε πλέον να συνδεθείτε κανονικά στην ιστοσελίδα μας.",
                html: emailTemplate(user)
            })

            return res.status(200).json({ success: true, user });
        } else {
            return res.status(200).json({ success: true, error: 'Δεν έγινε η αλλαγή του ρόλου του χρήστη' })
        }

    } catch (error) {
        res.status(400).json({ success: false });

    }
}