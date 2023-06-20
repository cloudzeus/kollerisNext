
import connectMongo from '../../../../server/config';
import User from "../../../../server/models/userModel";
import bcrypt from 'bcrypt';





export default async function handler(req, res) {
  console.log('reqbody' + JSON.stringify(req.body))
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
   


    const user = await User.create({password: hashPassword, email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, role: 'user' })
    console.log('CREATE USER IN DATABASE:' + JSON.stringify(user))
    if(user) {
        handleApi(user)
        return res.status(200).json({success: true, error: null, user: user, registered: true})
    }

    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data'})
  }
}






//Call the api to send the email and create the email template:
const handleApi = async (user) => {

  const res = fetch(`${process.env.BASE_URL}/api/user/userVerificationViaEmail`, {
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
<a href="${process.env.BASE_URL}/api/user/change-user-role?id=${user?._id}" target="_blank">Επιβεβαίωση εγγραφής</a>
`

