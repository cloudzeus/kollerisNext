
import connectMongo from '../../../../server/config';
import User from "../../../../server/models/userModel";
// 



export default async function handler(req, res) {
 

  try {

    await connectMongo();
    //4)DATABASE LOOKUP FOR EXISTING EMAIL:
    const alreadyEmailCheck = await User.findOne({ email: req.body.email })

    if(alreadyEmailCheck) {
     return res.status(200).json({success: false,  error: 'Το email είναι ήδη εγγεγραμένο', user: null})
    } 

    //USER WAS CREATED:
    const user = await User.create({password: req.body.password, email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, role: 'user' })
    //USER CREATION FAILED:
    if(!user && !alreadyEmailCheck) {
      return res.status(200).json({success: false, error: 'Πρόβλημα στην δημιουργία χρήστη',  user: null})
    } else {
        //USER CREATION SUCCESS:
        handleApi(user)
        return res.status(200).json({success: true, error: null,  user: user, registered: true})
        //create the email:
    }

   
  
      
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data'})
  }
}



const handleApi = async ({user}) => {
  const res = fetch('http://localhost:3000/api/user/userVerificationViaEmail', {
      method: 'POST',
      body: JSON.stringify(emailBody(user)),
      headers: {
          'Content-Type': 'application/json',
      }
  })
}


const emailBody = (user) => `
<p>O χρήστης <strong>${user?.firstName} ${user?.lastName}</strong> έχει ζητήσει εγγραφή στον ιστότοπο σας</p> 
<p>Πατήστε τον παρακάτω σύνδεσμο για να επιβεβαιώσετε την εγγραφή του</p>
<a href="http://localhost:3000/api/user/change-user-role?id=${user?._id}" target="_blank">Επιβεβαίωση εγγραφής</a>
`