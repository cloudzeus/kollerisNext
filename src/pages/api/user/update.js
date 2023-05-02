import User from '../../../../server/models/userModel';
import connectMongo from '../../../../server/utils/connection'

export default async function handler(req, res) {
  console.log('req body' + JSON.stringify(req.body))
  try {
    await connectMongo();
    const user = await User.findByIdAndUpdate({ _id: req.body._id}, {firstName: req.firstName, lastName: req.lastName, email: req.email});
    console.log('updated user' + JSON.stringify(user))
    if(user) {
      res.status(200).json({ success: true, user });
    } else {
      res.status(200).json({ success: false, user: null });
    }
    
    
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
