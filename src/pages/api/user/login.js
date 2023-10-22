
import User from '../../../../server/models/userModel';
import connectMongo from '../../../../server/config';
import { signJwtAccessToken } from '@/utils/jwt';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  console.log('reqbody :'  + JSON.stringify(req.body))
  try {
    
    await connectMongo();
    // const result = await User.findOne({email: req.body.username , password: req.body.password });
    const user = await User.findOne({email: req.body.username});
    console.log('100: user in login api: ' + JSON.stringify(user))
    const passwordMatches = await bcrypt.compare(req.body.password ,user.password);
    console.log('200: passwordMatches in login api: ' + JSON.stringify(passwordMatches))
    // console.log('Connect to database and fetch user: ' +   JSON.stringify(result))
      
    if(passwordMatches) {
		const payload = {
			sub: user?.email,
			jti: user?._id,
		  }

      console.log('500 payload in login api: ' + JSON.stringify(payload))
		  const accessToken = signJwtAccessToken(payload);
      console.log('300: user in login Access Token : ' + JSON.stringify(accessToken))
     	return res.status(200).json({success: true, accessToken: accessToken, user: user});
    } 
    else {
      return res.status(200).json({success: false, user: null});
    }
  
    
  } catch (error) {
    res.status(400).json({ success: false, error: 'ERROR: failed to fetch user' });
  }

}