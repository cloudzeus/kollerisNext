import { Brands } from "@/components/grid/Product/ΑddProductConfig";
import connectMongo from "../../../../../server/config";
import Supplier from "../../../../../server/models/suppliersSchema";
export const config = {
  api: {
    responseLimit: false,
  },
}
export default async function handler(req, res) {
  let response = {
    count: 0,
    error: null,
    success: false,
    message: 'request did not work',
    result: [],
  }
  
  if (req.method === 'GET') {
   
        try {
            let result = await Supplier.find({}).sort({Brands: 1});
            console.log(result)
            response.result = result;
            response.success = true;
            response.count = result.length;
            return res.status(200).json(response);
        } catch (e) {
            response.error = e;
            response.message = 'request did not work';
            response.success = false;
        
        }
      
  }


  

  



}

