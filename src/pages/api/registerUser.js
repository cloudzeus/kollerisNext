

import connectMongo from "../../../server/utils/connection";
import User from "../../../server/models/userModel";

// 
let regexEmail = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
let regexPass = new RegExp('/^(?=.*[A-Z]).{8,}$/');



export default async function handler(req, res) {
  try {
    await connectMongo();
    let password = req.body.password;
    let email = req.body.email;
    if(!regexEmail.test(email)) {
      res.status(200).json({  error: 'invalid email' })
    }
    if(!regexPass.test(password)) {
      res.status(200).json({  error: 'invalid email' })
    }
    const user = await User.create(req.body);
    res.status(200).json({  user })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}