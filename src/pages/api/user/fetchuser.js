
import User from "../../../../server/models/userModel";
import connectMongo from "../../../../server/config";
export default async function handler(req, res) {
  try {
    await connectMongo();
    console.log('100')
    console.log(req.body)
    const user = await User.findOne({email: req.body.username, password: req.body.password });
    console.log('Connect to database and fetch user: ' +   JSON.stringify(user))
    if(user) {
      res.status(200).json({ success: true, user: user });
    } else {
      res.status(200).json({ success: false, user: null });
    }
    
    
  } catch (error) {
    res.status(400).json({ success: false });
  }


}