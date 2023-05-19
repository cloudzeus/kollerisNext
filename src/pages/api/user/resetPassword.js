import { transporter, email } from "@/utils/nodemailerConfig"
import User from "../../../../server/models/contactInfoModel"
import connectMongo from "../../../../server/config"
import bcrypt from 'bcrypt';


export default async function handler(req, res) {
    console.log(req.body)

    let action = req.body?.action
    if (action === 'sendResetEmail') {
        try {
            console.log('Send email to user with link to reset password')
            const emailTo = req.body.email
            await connectMongo();
            let user = await User.findOne({ email: emailTo })
            console.log(user)
           
            if (user) {
                await transporter.sendMail({
                    from: email,
                    to: emailTo,
                    subject: 'Αλλαγή Κωδικού',
                    html: emailBody(emailTo)
                })

                return res.status(200).json({ success: true, error: null })


            } else {
                return res.status(200).json({ success: false, error: 'Δεν υπάρχει χρήστης με αυτό το email', user: null })
            }

        } catch (error) {

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



const emailBody = (emailTo) => `<p>Kαλησπέρα σας, πατήστε τον παρακάτω σύνδεσμο για αλλαγή Κωδικού</p> 
<a href="${process.env.BASE_URL}/api/user/createNewPasswordApi?email=${emailTo}">Aλλαγή Kωδικού 2</a>`
