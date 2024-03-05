import { transporter, email } from "@/utils/nodemailerConfig"
import connectMongo from "../../../../server/config"
import bcrypt from 'bcrypt';


export default async function handler(req, res) {
        const email = req.query?.email

              const redirectUrl = `/auth/create-new-password?email=${email}`;
              res.redirect(302, redirectUrl);
            
         
        
    }


    
    
