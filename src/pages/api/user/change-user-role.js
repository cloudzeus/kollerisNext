import User from '../../../../server/models/userModel';
import connectMongo from '../../../../server/config';
import { transporter } from '@/utils/nodemailerConfig';


const emailTemplate = (user) =>  `
    <p>Γειά σου, <strong>${user.firstName}</strong></p>
    <p>Η εγγραφή σου ολοκληρώθηκε μπορείς να πατήσεις τον παρακάτω σύνδεσμο για να συνδεθείς</p>
    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/signin">Σύνδεση</a>
`


export default async function handler(req, res) {
    const postId = req.query.id;


    try {
        await connectMongo();
        await User.updateOne({ _id: postId }, { role: 'employee' });
        const user = await User.findOne({ _id: postId });


        if (user && user.role === 'employee') {
          
            const mail = {
                from: process.env.NODEMAILER_USER,
                to: user.email,
                cc: ['info@kolleris.com'],
                subject: `Επιβεβαίωση Εγγραφής`,
                text: "Mπορείτε πλέον να συνδεθείτε κανονικά στην ιστοσελίδα μας.",
                html: emailTemplate(user)
            };
        
            transporter.sendMail(mail, (err, info) => {
                if (err) {
        
                } else {
                }
            });
            res.redirect('/auth/admin-email-confirmation');

        } else {
            return res.status(200).json({ success: true, error: 'Δεν έγινε η αλλαγή του ρόλου του χρήστη' })
        }

    } catch (error) {
        res.status(400).json({ success: false });

    }
}