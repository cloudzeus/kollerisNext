
import connectMongo from "../../../server/utils/connection";
import User from "../../../server/models/userModel";


export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        await connectMongo();
        const user = await User.findOne({});
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        await connectMongo();
        const user = await User.create(req.body);
        res.status(201).json({ success: true, user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const user = await User.findByIdAndUpdate(req.query.id, req.body, {
          new: true,
          runValidators: true,
        });
        if ( user) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const deleteUser = await User.findByIdAndRemove(req.query.id);
        if (!deleteUser) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
