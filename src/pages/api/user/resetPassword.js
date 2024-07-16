import { transporter } from "@/utils/nodemailerConfig"
import User from "../../../../server/models/userModel";
import connectMongo from "../../../../server/config"
import bcrypt from 'bcrypt';


export default async function handler(req, res) {

    let action = req.body?.action
    if (action === 'sendResetEmail') {
        try {
            const emailTo = req.body.email
            await connectMongo();
            let user = await User.findOne({ email: emailTo })
            if(!user) throw new Error('Δεν βρέθηκε χρήστης με αυτό το email')
            let email = await sendResetEmail({emailTo});
            if (!email.status) throw new Error(email.message)
            return res.status(200).json({
                success: true,
                message: 'Επιτυχής αποστολή email για αλλαγή κωδικού'
            })
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message
            })
        }


    }

    if (action === 'finalReset') {
        let { password, email } = req.body
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password?.password, salt);
        await connectMongo();
        try {
            let user = await User.updateOne(
                { email: email },
                { password: hashPassword });
            if(!user) throw new Error('Δεν βρέθηκε χρήστης με αυτό το email')
            return res.status(200).json({
                success: true,
                message: 'Επιτυχής αλλαγή κωδικού'
            })
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e.message
            
            })
        }
    }

}


function sendResetEmail({emailTo}) {
    const htlm = `<p>Kαλησπέρα σας, πατήστε τον παρακάτω σύνδεσμο για αλλαγή Κωδικού</p> 
    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/api/user/createNewPasswordApi?email=${emailTo}">Aλλαγή Kωδικού</a>`
  
    const mail = {
      from: process.env.NODEMAILER_USER,
      to: [emailTo],
      subject: "Αλλαγή Κωδικού",
      html: htlm,
    };
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(mail, (err, info) => {
        if (err) {
          resolve({
            status: false,
            message: err.message,
          }); // Resolve with an object containing status false and the error message
        } else {
          resolve({
            status: true,
            message: "Email sent successfully",
          }); // Resolve with an object containing status true and a success message
        }
      });
    });
  }
  


