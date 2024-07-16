
import User from "../../../../server/models/userModel";
import connectMongo from "../../../../server/config";
import bcrypt from 'bcrypt';


export default async function handler(req, res) {
  try {
    await connectMongo();


    const user = await User.findOne({email: req.body.username});
    const passwordMatches = await bcrypt.compare(req.body.password ,user.password);
    if(passwordMatches) {
      res.status(200).json({ success: true, user: user });
    } else {
      res.status(200).json({ success: false, user: null });
    }
    
    
  } catch (error) {
    res.status(400).json({ success: false });
  }


}