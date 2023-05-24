import User from '../../../../server/models/userModel';
import connectMongo from '../../../../server/config';

export default async function handler(req, res) {
  console.log('Update user')
  const {body} = req
  console.log(body)

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