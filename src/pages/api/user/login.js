
import User from '../../../../server/models/userModel';
import connectMongo from '../../../../server/config';
import { signJwtAccessToken } from '@/utils/jwt';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  try {
    
    await connectMongo();
    // const result = await User.findOne({email: req.body.username , password: req.body.password });
    const user = await User.findOne({email: req.body.username});
    const passwordMatches = await bcrypt.compare(req.body.password ,user.password);
      
    if(passwordMatches) {
		const payload = {
			sub: user?.email,
			jti: user?._id,
		  }

		  const accessToken = signJwtAccessToken(payload);
      if(user.role === 'user') {
        return res.status(200).json({success: true, accessToken: accessToken, user: user, message: 'Ο χρήστης υπάρχει, αλλά δεν μπορείτε να συνδεθείτε ακόμα'});
      }
     	return res.status(200).json({success: true, accessToken: accessToken, user: user});
    } 
    else {
      return res.status(200).json({success: false, user: null});
    }
  
    
  } catch (error) {
    res.status(400).json({ success: false, error: 'ERROR: failed to fetch user' });
  }

}