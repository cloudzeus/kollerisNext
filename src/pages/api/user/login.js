
import User from '../../../../server/models/userModel';
import connectMongo from '../../../../server/utils/connection'
import { signJwtAccessToken } from '@/pages/lib/jwt';

export default async function handler(req, res) {
  console.log('reqbody' + JSON.stringify(req.body))
  try {
    await connectMongo();
    const user = await User.findOne({email: req.body.username , password: req.body.password });
    
    if(user) {
      const payload = {
        sub: user?.email,
        jti: user?._id,
      }

      const accessToken = signJwtAccessToken(payload);
      res.status(200).json({ success: true, ...user, accessToken: accessToken});
    } 
    else {
      res.status(200).json({ success: false, user: null });
    }
  
    
  } catch (error) {
    res.status(400).json({ success: false });
  }

}