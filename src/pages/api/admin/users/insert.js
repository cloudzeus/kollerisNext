import bcrypt from 'bcrypt';
import User from '../../../../../server/models/userModel';
import connectMongo from '../../../../../server/config';

export default async function handler(req, res) {

    
    //iNSERT NEW USER
        const data = req.body.value;
        console.log(data)
        try {
            await connectMongo();
            let password = data.password;
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            console.log('hassPassword' + JSON.stringify(hashPassword ))

            const user = await User.create({password: hashPassword, email:  data.email, firstName:  data.firstName, lastName: data.lastName, role: data.role })

            console.log('user' + JSON.stringify(user))
            let fake = false;
            if(user ) {
              return  res.status(200).json({success: true, user: user});
            } 
            else {
              return res.status(500).json({success: false, user: null});
            }
        
            
        } catch (error) {
          return res.status(400).json({ success: false, error: 'failed to fetch user' });
        }

    //UPDATE SELECTED USER:



}

