import connectMongo from "../../../../server/config";
import User from "../../../../server/models/userModel";
import bcrypt from "bcrypt";
import { transporter } from "@/utils/nodemailerConfig";

export default async function handler(req, res) {
  const response = {
    success: false,
    message: "",
    error: null,
    result: null,
  };

  const password = req.body.password;
  try {
    await connectMongo();
    //DATABASE LOOKUP FOR EXISTING EMAIL:
    const alreadyEmailCheck = await User.findOne({ email: req.body.email });
    if (alreadyEmailCheck) {
      response.success = false;
      response.message = "Το email είναι ήδη εγγεγραμένο";
      return res.status(200).json(response);
    }

    // HASH THE PASSWORD:
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      password: hashPassword,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: "user",
      status: true,
    });
    if (user) {
      response.success = true;
      response.message = "Η εγγραφή ήταν επιτυχής";
      // SEND CONFIRMATION EMAIL:
      const sendConfirmationEmail = await sendConfirmEmail(user);
      if(!sendConfirmationEmail.status) {
        response.message = "Η εγγραφή ήταν επιτυχής, αλλά δεν στάλθηκε email επιβεβαίωσης";
      }
      return res.status(200).json(response);
    } else {
      response.success = false;
      response.message = "Η εγγραφή δεν ήταν επιτυχής";
      return res.status(200).json(response);
    }
  } catch (err) {
    response.success = false;
    response.message = "Σφάλμα κατά την εγγραφή";
    response.error = err;
    return res.status(400).json(response);
  }
}

function sendConfirmEmail(user) {
  const htlm = `
  <p>O χρήστης <strong>${user?.firstName} ${user?.lastName}</strong> έχει ζητήσει εγγραφή στον ιστότοπο σας</p> 
  <p>Πατήστε τον παρακάτω σύνδεσμο για να επιβεβαιώσετε την εγγραφή του</p>
  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/api/user/change-user-role?id=${user?._id}" target="_blank">Επιβεβαίωση εγγραφής</a>
  `;

  const mail = {
    from: process.env.NODEMAILER_USER,
    to: ["giannis.chiout@gmail.com"],
    cc: [process.env.NODEMAILER_USER, "info@kolleris.com"],
    text: "Ένας νέος χρήστης έχει ζητήσει να εγγραφεί στην ιστοσελίδα σας.",
    subject: "Νέα Εγγραφή Χρήστη",
    html: htlm,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mail, (err, info) => {
      if (err) {
        resolve({
          status: false,
          message: err.message,
        }); // Resolve with an object containing status false and the error message
      } else {
        resolve({
          status: true,
          message: "Email sent successfully",
        }); // Resolve with an object containing status true and a success message
      }
    });
  });
}

