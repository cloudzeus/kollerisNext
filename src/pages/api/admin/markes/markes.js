import Markes from "../../../../../server/models/markesModel";
import connectMongo from "../../../../../server/config";
import { rewrites } from "../../../../../next.config";
export default async function handler(req, res) {

    // try {
    //   await connectMongo();
    //       let data = req.body.data
    //       const newMarkes = await Markes.create({
    //           name:'product1',
    //           description: 'description of product 1',
    //           logo: 'https://localohost:3000/assets/imgs/luffy.png',
    //           videoPromoList: [
    //             {
    //               name: 'video1',
    //               videoUrl: 'https://localohost:3000/assets/imgs/luffy.png'
    //             }
    //           ],
    //           photosPromoList: [
    //             {
    //               name:'sefsefsef',
    //               photosPromoUrl: 'sesefsefs'
    //             }
    //           ],
    //           pimAccess: {
    //             pimUrl: 'https://pimurl',
    //             pimUserName:'pimUserName',
    //             pimPassword: '1234567'
    //           },
    //           webSiteUrl: 'website url',
    //           officialCatalogueUrl: 'catalogues url',
    //           facebookUrl: 'facebook url',
    //           instagramUrl: 'instagram url',
    //           softOneMTRMARK: 1,
    //           softOneName: 'softone name',
    //           softOneCode: 'softone code',
    //           softOneSODCODE: 'softonesodcode',
    //           softOneISACTIVE: 1,
    //       })
    //       console.log(newMarkes);
    //       return res.status(200).json({success: true, markes: newMarkes});
    // } catch (error) {
    //       console.log(error)
    // }
    let action = req.body.action;
    if (action === 'findAll') {
      try {
        await connectMongo();
         const markes = await Markes.find({});
         if(markes) {
          // console.log(markes)
          return  res.status(200).json({success: true, markes: markes});
             
         }
         else {
          return  res.status(200).json({success: false, markes: null});
         }
       
         
       } catch (error) {
        return  res.status(400).json({ success: false, error: 'failed to fetch user' });
       }
     
    }
    if (action === 'create') {
      // Create a new document
      let {data} = req.body
      let createBody = {
        name: data.name,
        description: data.description,
        facebookUrl: data.facebookUrl,
        instagramUrl: data.instagramUrl,
        officialCatalogueUrl: data.officialCatalogueUrl,
        softOneMTRMARK: data.softOneMTRMARK,
        softOneName: data.softOneName,
        softOneCode: data.softOneCode,
        softOneSODCODE: data.softOneSODCODE,
        softOneISACTIVE: data.softOneISACTIVE,
        pimAccess: {
          pimUrl: data.pimUrl,
          pimUserName: data.pimUserName,
          pimPassword: data.pimPassword,
        },
        videoPromoList: [{
          name: 'sfef',
          videoUrl: 'sefsefefsf'
        }],
        photosPromoList: [{
          name: 'sefsef',
          photosPromoUrl: 'sefsef'
        }],
        logo: 'sefsefseffesef'
      }
      try {
        await connectMongo();
            // let data = req.body.data
            let a ='se'
            let b = 'sefsef'
            
            console.log(data)
            const newMarkes = await Markes.create({
               ...data
            })

        if(newMarkes) {
            console.log('new markes')
            console.log(newMarkes)
            return res.status(200).json({success: true, markes: newMarkes});
           
        } else {
          return res.status(200).json({success: false, markes: null});
        }

       
      } catch (error) {
        return res.status(400).json({success: false, error: error.message });
      }
    } 
    
    if (action === 'delete') {
      await connectMongo();
      
      let id = req.body.id;
      console.log('backend id')
      console.log(id)
      try {
        let deletedOne = await Markes.findByIdAndDelete(id);
        return res.status(200).json({success: true, markes: deletedOne});
      }
      catch (error) {
        console.log(error)
        return res.status(400).json({success: false, error: 'Αποτυχία διαγραφής'});
      }
    }
    
  }


  // let data = {
  //   name: '4',
  //   description: 'sefsefesfsefsefse',
  //   facebookUrl: 'fsefsefsefse',
  //   instagramUrl: 'fsefsefsefsef',
  //   officialCatalogueUrl: 'sefsefsefsefse',
  //   softOneMTRMARK: 1001,
  //   softOneName: 'sefsefes',
  //   softOneCode: 'fsefsefsefse',
  //   softOneSODCODE: 'fsefesfsefse',
  //   softOneISACTIVE: 1,
  //   pimAccess: {
  //     pimUrl: 'sefsefsefse',
  //     pimUserName: '',
  //     pimPassword: 'sefsfeefseffesf',
  //   },
  //   videoPromoList: [{
  //     name: 'sfef',
  //     videoUrl: 'sefsefefsf'
  //   }],
  //   photosPromoList: [{
  //     name: 'sefsef',
  //     photosPromoUrl: 'sefsef'
  //   }],
  //   logo: 'sefsefseffesef'
  // }