import Markes from "../../../../../server/models/markesModel";
import connectMongo from "../../../../../server/config";
export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Create a new document
    

      try {
        await connectMongo();
        const { 
            name, 
            description, 
            logo, 
            videoPromoList, 
            photosPromoList, 
            pimAccess, 
            webSiteUrl, 
            officialCatalogueUrl, 
            facebookUrl, 
            instagramUrl, 
            softOneMTRMARK, 
            softOneName, 
            softOneCode, 
            softOneSODCODE, 
            softOneISACTIVE } = req.body;
  
            const newMarkes = await Markes.create({
                name: data.name,
                description: data.description,
                logo: data.logo,
                videoPromoList: data.videoPromoList,
                photosPromoList: data.photosPromoList,
                pimAccess: data.pimAccess,
                webSiteUrl: data.webSiteUrl,
                officialCatalogueUrl: data.officialCatalogueUrl,
                facebookUrl: data.facebookUrl,
                instagramUrl: data.instagramUrl,
                softOneMTRMARK: data.softOneMTRMARK,
                softOneName: data.softOneName,
                softOneCode: data.softOneCode,
                softOneSODCODE: data.softOneSODCODE,
                softOneISACTIVE: data.softOneISACTIVE,
            })

        if(newMarkes) {
            res.status(201).json(savedMarkes);
        }
       
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    } 
    
    if (req.method === 'GET') {
      // Retrieve all documents
      try {
        const markes = await Markes.find();
        res.status(200).json(markes);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }