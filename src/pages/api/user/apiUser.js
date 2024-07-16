import axios from "axios";

import User from "../../../../server/models/userModel";
import connectMongo from "../../../../server/config";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  let action = req.body.action;
  if (!action)
    return res
      .status(400)
      .json({ success: false, error: "no action specified" });

  if (action === "findAll") {
    try {
      await connectMongo();

      const users = await User.find({});
      const _users = [...users];

      return res.status(200).json({ success: true, result: users });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error: "failed to fetch user", result: null });
    }
  }

  if (action === "create") {
    const { data } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    try {
      await connectMongo();
      const alreadyEmailCheck = await User.findOne({ email: data.email });
      if (alreadyEmailCheck) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Το email είναι ήδη εγγεγραμένο",
          });
      }
      const user = await User.create({
         address: {
            country: data.country,
            address: data.address,
            city: data.city,
            postalcode: data.postalcode,
         }, 
         phones: {
            mobile: data.mobile,
            landline: data.landline,
         },
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: hashPassword,
          role: data.role,
          status: true,
      });
      if (!user) throw new Error("Αποτυχία εισαγωγής")
      return res.status(200).json({ 
        success: true, 
        message: "O χρήστης δημιουργήθηκε με επιτυχία"
      });
    } catch (e) {
      return res
        .status(400)
        .json({ 
          success: false, 
          error: e.message,
          });
    }
  }

  if (action === "update") {
    const { id, data } = req.body;
    const update = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
      address: {
        country: data.country,
        address: data.address,
        city: data.city,
        postalcode: data.postalcode,
      },
      phones: {
        mobile: data.mobile,
        landline: data.landline,
      },
      updatedFrom: data.updatedFrom,
    };
    if (data.newPassword) {
      const password = data.newPassword;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      update.password = hashPassword;
    }
    
    try {
      await connectMongo();
      const result = await User.findOneAndUpdate(
        { _id: id },
        {
          $set: update,
        }, {
          new: true
        }
      );
      return res.status(200).json({ success: true, result: result });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Aποτυχία εισαγωγής", markes: null });
    }
  }

  if (action === "delete") {
    await connectMongo();
    let id = req.body.id;
    try {
      await connectMongo();
      const result = await User.deleteOne({ _id: id });
  
      return res.status(200).json({ success: true, result: result });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Aποτυχία εισαγωγής", result: null });
    }
  }

  if (action === "findRole") {
    const { email } = req.body;
    try {
      await connectMongo();
      const user = await User.findOne({ email: email }, { role: 1 });
      if (!user)
        return res
          .status(200)
          .json({ success: false, result: null, error: "Δεν βρέθηκε χρήστης" });
      if (user?.role === "user") {
        return res
          .status(200)
          .json({
            success: false,
            message: "Δεν έχετε δικαιώματα!",
            result: null,
          });
      } else {
        return res
          .status(200)
          .json({
            success: true,
            message: "Μπορείτε να συνδεθείτε",
            error: null,
          });
      }
    } catch (e) {
      return res
        .status(400)
        .json({ success: false, error: "Aποτυχία εισαγωγής", result: null });
    }
  }
}
