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
  if (req.method === 'POST' && req.body.action === 'getClients') {
        console.log(req.body)
        const {name, TRDR, afm, id, phone} = req.body;
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
            let result = await Clients.find(filterConditions);
            console.log(result)
            response.result = result;
            response.success = true;
            response.message = 'Clients found';
            response.count = result.length;
            return res.status(200).json(response);
        } catch (e) {
            response.error = e;
            console.log(e)
            response.message = 'request did not work';
            response.success = false;
        
        }
      
  }


  if(req.method === 'POST' && req.body.action === 'createClient') {
      let {client} = req.body;
      console.log(client)
      if(!client) {
        return res.status(400).json({message: 'No body provided'})
      }

      if(!client.NAME || !client.TRDR  ) {
        response.error = true;
        response.message = 'Please provide a NAME, TRDR';
        return res.status(400).json(response)
      }
      try {
        let create = await Clients.create(client);
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
    let {body, identifierTRDR, identifierID, identifierPhone, identifierAFM } = req.body;
    console.log('update')
    console.log(body)
 

    if(!identifierTRDR && !identifierID && !identifierPhone && !identifierAFM) {
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
          {_id: identifierID},
          {PHONE01: identifierPhone},
          {AFM: identifierAFM}
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

