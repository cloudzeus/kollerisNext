
import User from '../../../../server/models/userModel';
import connectMongo from '../../../../server/utils/connection'
// 

export default async function handler(req, res) {
  console.log('reqbody' + JSON.stringify(req.body))
  try {
    await connectMongo();
    const user = await User.findOne({username: req.body.username, password: req.body.password });
    if(user) {
      res.status(200).json({ success: true, user });
    } else {
      res.status(200).json({ success: false, user: null });
    }
    
    
  } catch (error) {
    res.status(400).json({ success: false });
  }

}