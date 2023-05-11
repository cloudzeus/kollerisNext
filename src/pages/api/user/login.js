
import User from '../../../../server/models/userModel';
import connectMongo from '../../../../server/config';
import { signJwtAccessToken } from '@/pages/lib/jwt';

export default async function handler(req, res) {
  console.log('reqbody' + JSON.stringify(req.body))
  try {
    await connectMongo();
    // const result = await User.findOne({email: req.body.username , password: req.body.password });
    const user = await User.findOne({email: req.body.username , password: req.body.password });

    // console.log('Connect to database and fetch user: ' +   JSON.stringify(result))
      
    if(user) {
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