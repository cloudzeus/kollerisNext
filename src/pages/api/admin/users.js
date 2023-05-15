import bcrypt from 'bcrypt';
import User from '../../../../server/models/contactInfoModel';
import connectMongo from '../../../../server/config';

export default async function handler(req, res) {
   
    let action = req.body.action
    console.log('action: ' + JSON.stringify(action))
    //iNSERT NEW USER
    if(action === 'add') {
        try {
            console.log(req.body)
            
            await connectMongo();
            let password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            console.log('hassPassword' + JSON.stringify(hashPassword ))
            const user = await User.create({password: hashPassword, email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, role: req.body.role })
            console.log('user: ' + JSON.stringify(user)) 
            if(user) {
                res.status(200).json({success: true, user: user});
            }
            else {
            res.status(200).json({success: false, user: null});
            }
        
            
        } catch (error) {
            res.status(400).json({ success: false, error: 'failed to fetch user' });
        }
    }

    //UPDATE SELECTED USER:
    if(action === 'save') { 
        try {
            await connectMongo();
            await User.updateOne(
              { _id: body._id},  
              {
                firstName: body.firstName, 
                lastName: body.lastName,
                email: body.email,
                phones: {
                  landline: body.landline, 
                  mobile: body.mobile
                }, 
                address: {
                  address: body.address, 
                  country:body.country,
                  city: body.city,
                  postalcode: body.postalcode,
                }
              });
        
            const user = await User.findOne({ _id: body._id});
            res.status(200).json({ success: true, user });
            
            
          } catch (error) {
            res.status(400).json({ success: false });
        
         }
    }

    if(action === 'findAll') {
        try {
            await connectMongo();
            const user = await User.find({});
        
            if(user) {
                res.status(200).json({success: true, user: user});
            }
            else {
              res.status(200).json({success: false, user: null});
            }
          
            
          } catch (error) {
            res.status(400).json({ success: false, error: 'failed to fetch user' });
          }
        
    }
   

}


