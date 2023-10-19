
import connectMongo from '../../../../server/config';
import User from '../../../../server/models/userModel';
import bcrypt from 'bcrypt';
import { transporter } from '@/utils/nodemailerConfig';





export default async function handler(req, res) {
  console.log('reqbody' + JSON.stringify(req.body))
  // if(action === "sendEmailToAdmin") {
  //     const {email} = req.body;
  //   const mail = {
  //     from: 'info@kolleris.com',
  //     to: email,
  //     subject:`Προσφορά - NUM: ${num}`,
  //     html: `${body}`
  //   };
  //   function sendEmail(mail) {
  //     return new Promise((resolve, reject) => {
  //       transporter.sendMail(mail, (err, info) => {
  //         if (err) {
  //           console.log(err);
  //           resolve(false); // Resolve with false if there's an error
  //         } else {
  //           console.log('Email sent successfully!');
  //           resolve(true); // Resolve with true if the email is sent successfully
  //         }
  //       });
  //     });
  //   }
  //   let response = await sendEmail(mail);
    
  // }
  const password = req.body.password;
  try {
    await connectMongo();
    //DATABASE LOOKUP FOR EXISTING EMAIL:
    const alreadyEmailCheck = await User.findOne({ email: req.body.email })
    if(alreadyEmailCheck) {
     return res.status(200).json({success: false,  error: 'Το email είναι ήδη εγγεγραμένο', user: null})
    } 

    // HASH THE PASSWORD:
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    console.log('hassPassword' + JSON.stringify(hashPassword ))
   


    const user = await User.create({password: hashPassword, email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, role: 'user', status: true })
    console.log('CREATE USER IN DATABASE:' + JSON.stringify(user))
    if(user) {
        handleApi(user)
        return res.status(200).json({success: true, error: null, user: user, registered: true})
    }
    return res.status(200).json({success: true, error: null, user: user, registered: true})

    
  } catch (err) {
    return res.status(200).json({success: false, error: 'Αδυναμία σύνδεσης με τη βάση', user: null, registered: null})
  }
}






//Call the api to send the email and create the email template:
const handleApi = async (user) => {

  const res = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/userVerificationViaEmail`, {
      method: 'POST',
      body: JSON.stringify(emailBody(user)),
      headers: {
          'Content-Type': 'application/json',
      }
  })


}


const emailBody = (user) =>`
<p>O χρήστης <strong>${user?.firstName} ${user?.lastName}</strong> έχει ζητήσει εγγραφή στον ιστότοπο σας</p> 
<p>Πατήστε τον παρακάτω σύνδεσμο για να επιβεβαιώσετε την εγγραφή του</p>
<a href="${process.env.NEXT_PUBLIC_BASE_URL}/api/user/change-user-role?id=${user?._id}" target="_blank">Επιβεβαίωση εγγραφής</a>
`

