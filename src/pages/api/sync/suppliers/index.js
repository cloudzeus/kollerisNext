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
  if (req.method === 'POST' && req.body.action === 'getSuppliers') {

        const {name, TRDR, phone, afm, id} = req.body;
        let filterConditions = {};
        if(name) {
          filterConditions.NAME = new RegExp("^" + name, 'i');
        }
        if(TRDR) {
          filterConditions.TRDR = TRDR;
        }
        if(afm) {
          filterConditions.AFM = afm;
        }
        if(id) {
          filterConditions._id = id;
        }
        if(phone) {
          filterConditions.PHONE01 = phone;
        }
        try {
            let result = await Supplier.find(filterConditions);
            response.result = result;
            response.success = true;
            response.message = 'Suppliers found';
            response.count = result.length;
            return res.status(200).json(response);
        } catch (e) {
            response.error = e;
            response.message = 'request did not work';
            response.success = false;
        
        }
      
  }


  if(req.method === 'POST' && req.body.action === 'createSupplier') {
      let {supplier} = req.body;
      if(!supplier) {
        return res.status(400).json({message: 'No body provided'})
      }

      if(!supplier.NAME || !supplier.TRDR || !supplier.CODE ) {
        response.error = true;
        response.message = 'Please provide a NAME, TRDR and CODE';
        return res.status(400).json(response)
      }
      try {
        let create = await Supplier.create(supplier);
        response.success = true;
        response.message = 'Supplier created';
        response.result = create;
        return res.status(200).json(response);
      } catch (e) {

      }
  } 

  if(req.method === 'PUT') {
    let {body, identifierTRDR, identifierID } = req.body;

 

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
  
      response.success = true;
      response.message = 'Supplier updated';
      response.result = update;
      return res.status(200).json(response);
    } catch (e) {
      response.error = e;
      response.message = 'request did not work';
      response.success = false;
      return res.status(200).json(response);

    }
  }

  

  



}

