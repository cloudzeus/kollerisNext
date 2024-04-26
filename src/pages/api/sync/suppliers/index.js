import connectMongo from "../../../../../server/config";
import Supplier from "../../../../../server/models/suppliersSchema";
export const config = {
  api: {
    responseLimit: false,
  },
}
export default async function handler(req, res) {
  let response = {
    error: null,
    success: false,
    message: 'request did not work',
    result: [],
  }
  
  await connectMongo();
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


  if(req.method === 'POST') {
      let body = req.body;
      if(!body) {
        return res.status(400).json({message: 'No body provided'})
      }

      if(!body.NAME || !body.TRDR || !body.CODE ) {
        response.error = true;
        response.message = 'Please provide a NAME, TRDR and CODE';
        return res.status(400).json(response)
      }
      try {
        let create = await Supplier.create(body);
        response.success = true;
        response.message = 'Supplier created';
        response.result = create;
        return res.status(200).json(response);
      } catch (e) {

      }
  } 

  if(req.method === 'PUT') {
    let {body, identifierTRDR, identifierID } = req.body;
    console.log('update')
    console.log(body)
 

    if(!identifierTRDR && !identifierID) {
      response.error = true;
      response.message = 'Please provide an identifier';
      return res.status(400).json(response)
    }
    if(!body) {
      response.error = true;
      response.message = 'You did not provider any values to update';
      return res.status(400).json(response)
    }

    if(!body.NAME || !body.TRDR || !body.CODE ) {
      response.error = true;
      response.message = 'Please provide a NAME, TRDR and CODE';
      return res.status(400).json(response)
    }
    try {
   
      let update = await Supplier.findOneAndUpdate({
        $or: [
          {TRDR: identifierTRDR},
          {_id: identifierID}
        ]
      }, body, { new: true});
      console.log('update')
      console.log(update)
      response.success = true;
      response.message = 'Supplier updated';
      response.result = update;
      return res.status(200).json(response);
    } catch (e) {
      console.log(e)
      response.error = e;
      response.message = 'request did not work';
      response.success = false;
      return res.status(200).json(response);

    }
  }

  

  



}

