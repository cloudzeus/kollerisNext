
import User from '../../../../server/models/userModel';
import connectMongo from '../../../../server/config';
import { signJwtAccessToken } from '@/pages/lib/jwt';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  console.log('reqbody' + JSON.stringify(req.body))
  let password = req.body.password;
  try {
    await connectMongo();
    // const result = await User.findOne({email: req.body.username , password: req.body.password });
    const user = await User.findOne({email: req.body.username});
    console.log('user' + JSON.stringify(user))
    const passwordMatches = await bcrypt.compare(req.body.password ,user.password);
    // console.log('Connect to database and fetch user: ' +   JSON.stringify(result))
      
    if(passwordMatches) {
		const payload = {
			sub: user?.email,
			jti: user?._id,
		  }

		  const accessToken = signJwtAccessToken(payload);
     	res.status(200).json({success: true, accessToken: accessToken, user});
    } 
    else {
      res.status(200).json({success: false, user: null});
    }
  
    
  } catch (error) {
    res.status(400).json({ success: false, error: 'failed to fetch user' });
  }

}