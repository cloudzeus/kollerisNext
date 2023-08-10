import { transporter, email } from "@/utils/nodemailerConfig"
import User from "../../../../server/models/userModel";
import connectMongo from "../../../../server/config"
import bcrypt from 'bcrypt';


export default async function handler(req, res) {

    let action = req.body?.action
    if (action === 'sendResetEmail') {
        try {
            console.log('Send email to user with link to reset password')
            const emailTo = req.body.email
            await connectMongo();
            let user = await User.findOne({ email: emailTo })
            console.log(user)
           
            if (user) {

                const {firstName, lastName } = user
                await transporter.sendMail({
                    from: email,
                    to: emailTo,
                    subject: 'Αλλαγή Κωδικού',
                    html: emailBody(emailTo , firstName , lastName)
                })

                return res.status(200).json({ success: true, error: null })


            } else {
                return res.status(200).json({ success: false, error: 'Δεν υπάρχει χρήστης με αυτό το email', user: null })
            }

        } catch (error) {
            return res.status(500).json({ success: false, error: 'Aποτυχία σύνδεσης', user: null })
        }


    }

    if (action === 'finalReset') {
        console.log('1: Update database user password')
        let { password, email } = req.body
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        console.log('2: hashedPassword ', JSON.stringify(hashPassword))
        await connectMongo();
        let user = await User.updateOne(
            { email: email },
            { password: hashPassword });
        console.log(user)
        if (user) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ success: false });
        }
    }

}



const emailBody = (emailTo, firstName, lastName) => `<p>Kαλησπέρα σας, πατήστε τον παρακάτω σύνδεσμο για αλλαγή Κωδικού</p> 
<a href="${process.env.NEXT_PUBLIC_BASE_URL}/api/user/createNewPasswordApi?email=${emailTo}">Aλλαγή Kωδικού</a>`
