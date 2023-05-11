
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
    return res.status(200).json({success: true, error: null,  user: user})
    //USER CREATION FAILED:
    // if(!user && !alreadyEmailCheck) {
    //   return res.status(200).json({success: false, error: 'Πρόβλημα στην δημιουργία χρήστη',  user: null})
    // } else {
    //     //USER CREATION SUCCESS:
    //   return res.status(200).json({success: true, error: null,  user: user})
    // }
      
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data'})
  }
}