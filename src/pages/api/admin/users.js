import bcrypt from 'bcrypt';
import User from '../../../../server/models/contactInfoModel';
import connectMongo from '../../../../server/config';

export default async function handler(req, res) {

    
  

    let action = req.body.action
    let body = req.body
    console.log( 'action: ' + JSON.stringify(action) + '\n')
    console.log( 'req body users/users : ' + JSON.stringify(body) + '\n')

    //iNSERT NEW USER
    if(action === 'add') {

        try {
            await connectMongo();
              const alreadyEmailCheck = await User.findOne({ email: req.body.email })
            if(alreadyEmailCheck) {
            return res.status(200).json({success: false,  error: 'Το email είναι ήδη εγγεγραμένο', user: null})
            } 

            let password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            console.log('hassPassword' + JSON.stringify(hashPassword ))


            const user = await User.create({password: hashPassword, email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, role: req.body.role })
            if(user) {
              console.log(user)
              return  res.status(200).json({success: true, user: user});
            } 
            else {
              return res.status(200).json({success: false, user: null});
            }
        
            
        } catch (error) {
          return res.status(400).json({ success: false, error: 'Status 400: failed to fetch user' });
        }
    }

    //UPDATE SELECTED USER:
    if(action === 'edit') { 
      console.log('Update selected user')
        try {
            await connectMongo();
            await User.updateOne(
              { _id: body?._id},  
              {
                firstName: body?.firstName, 
                lastName: body?.lastName,
                email: body?.email,
                phones: {
                  landline: body?.landline, 
                  mobile: body?.mobile
                }, 
                address: {
                  address: body?.address, 
                  country:body?.country,
                  city: body?.city,
                  postalcode: body?.postalcode,
                }
              });
        
            const user = await User.findOne({ _id: body._id});
            console.log('------------ Request to the database to update user: ' + JSON.stringify(user))
            return res.status(200).json({ success: true, user: user });
            
            
          } catch (error) {
            return  res.status(400).json({ success: false, user: null, error: '500: failed to update user'});
        
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



