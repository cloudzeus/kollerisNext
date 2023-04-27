

import connectMongo from "../../../server/utils/connection";
import User from "../../../server/models/userModel";

// 

export default async function handler(req, res) {
  try {
    await connectMongo();
    const user = await User.create(req.body);
    res.status(200).json({  user })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}