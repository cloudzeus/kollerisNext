import connectMongo from "../../../../../server/config";
import Clients from "../../../../../server/models/modelClients";
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
  
  await connectMongo();
  if (req.method === 'GET') {

        try {
            let result = await Clients.find({});
            // console.log(result)
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

      if(!body.NAME || !body.TRDR  ) {
        response.error = true;
        response.message = 'Please provide a NAME, TRDR';
        return res.status(400).json(response)
      }
      try {
        let create = await Clients.create(body);
        response.success = true;
        response.message = 'Client created';
        response.result = create;
        return res.status(200).json(response);
      } catch (e) {
        response.error = e;
        response.message = 'request did not work';
        response.success = false;
        return res.status(200).json(response);
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

    if(!body.NAME || !body.TRDR ) {
      response.error = true;
      response.message = 'Please provide a NAME, TRDR ';
      return res.status(400).json(response)
    }
    try {
   
      let update = await Clients.findOneAndUpdate({
        $or: [
          {TRDR: identifierTRDR},
          {_id: identifierID}
        ]
      }, body, { new: true});
    
      response.success = true;
      response.message = 'Client updated';
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

