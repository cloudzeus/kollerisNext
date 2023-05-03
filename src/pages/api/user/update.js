import User from '../../../../server/models/userModel';
import connectMongo from '../../../../server/utils/connection'

export default async function handler(req, res) {
  console.log('are we here?')
  const {body} = req
  console.log(body)

  try {
    await connectMongo();
    // await User.updateOne({ _id: body._id},  {firstName: body.firstName, phones: {landline: body?.landline, mobile: body?.mobile}});
    await User.updateOne({ _id: body._id},  {firstName: body.firstName, phones: {landline: '210-433545', mobile: '234234234'}});
    const user = await User.findOne({ _id: body._id});
    res.status(200).json({ success: true, user });
    
    
  } catch (error) {
    res.status(400).json({ success: false });

 }
}