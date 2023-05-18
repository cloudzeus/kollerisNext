import { transporter, email } from "@/utils/nodemailerConfig"
import User from "../../../../server/models/contactInfoModel"
import connectMongo from "../../../../server/config"
import bcrypt from 'bcrypt';


export default async function handler(req, res) {
    console.log(req.body)
        
        let action = req.body?.action
        if(action ==='sendResetEmail') {
            const emailTo = req.body.email
            await connectMongo();
            let user = await User.findOne({email: emailTo})
            console.log(user)
            if(user) {
                    const emailBody = `
                    <p>Kαλησπέρα σας, πατήστε τον παρακάτω σύνδεσμο για αλλαγή Κωδικού</p> 
                    <a href="${process.env.BASE_URL}/api/user/createNewPasswordApi?email=${emailTo}">Aλλαγή Kωδικού 2</a>
                    `
                    try {
                        await transporter.sendMail({
                            from: email,
                            to: emailTo,
                            subject: 'Αλλαγή Κωδικού',
                            html: emailBody
                        })

                        return  res.status(200).json({ success: true, error: null })

                    } catch (error) {
                        console.log(error)
                        return res.status(400).json({ success: false, error: error })
                    }
            }
            
        }
    
        if(action === 'finalReset') {
            console.log('Update database user password')
            let {password, email} = req.body
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            await connectMongo();
            let user =  await User.updateOne(
            { email: email},  
            {password: hashPassword});
            console.log(user)
            if(user) {
                return res.status(200).json({success: true});
            } else {
                return res.status(400).json({success: false});
            }
        }

    }


    
    
