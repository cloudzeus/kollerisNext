import User from '../../../../server/models/userModel';
import connectMongo from '../../../../server/utils/connection'

export default async function handler(req, res) {
  console.log('are we here?')
  const {body} = req

  try {
    await connectMongo();
    await User.updateOne({ _id: body._id},  {firstName: body.firstName});
    const user = await User.findOne({ _id: body._id});
    res.status(200).json({ success: true, user });
    
    
  } catch (error) {
    res.status(400).json({ success: false });

 }
}