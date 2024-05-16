
import connectMongo from "../../../server/config";
import SoftoneProduct from "../../../server/models/newProductModel";
import UploadedProduct from "../../../server/models/uploadedProductsModel";
export default async function handler(req, res) {
    const { data,  UNIQUE_CODE } = req.body;
  
 
    try {
        await connectMongo();
        let productData = {
            DESCRIPTION: data?.description || '',
            NAME: data?.NAME,
            SOFTONESTATUS: false,
            COUNTRY: data?.COUNTRY || '',
            VAT: data?.VAT || '',
            CODE1: data?.CODE1 || '',
            CODE2: data?.CODE2 ,
            PRICER: data.PRICER ? parseFloat(data.PRICER.toFixed(2)) : 0,
            PRICEW: data.PRICEW ? parseFloat(data.PRICEW.toFixed(2)) : 0,
            COST: data.COST ? parseFloat(data.COST.toFixed(2)) : 0 ,
            PRICER01: data?.PRICER01 ? parseFloat(data?.PRICER01.toFixed(2)) : 0,
            WIDTH: data?.WIDTH || '',
            HEIGHT: data?.HEIGHT || '',
            LENGTH: data["ΠΛΑΤΟΣ"] ? data["ΠΛΑΤΟΣ"] : '',
            hasImage: false,
            uploaded: true,
        }

        //CREATE THE UPLOADED PRODUCT FOR THIS SUPPLIER
        const uploadedOBJ = {
            NAME: data.NAME,
            PRICER: data.PRICER ? parseFloat(data.PRICER.toFixed(2)) : 0,
            PRICEW: data.PRICEW ? parseFloat(data.PRICEW.toFixed(2)) : 0,
            COST: data.COST ? parseFloat(data.COST.toFixed(2)) : 0,
            PRICER01: data?.PRICER01 ? parseFloat(data?.PRICER01.toFixed(2)) : 0,
            UNIQUE_CODE:  UNIQUE_CODE,
        }
      
        let uploadedProduct = await UploadedProduct.create(uploadedOBJ)
      
        //CREATE A FILTER WITH EITHER THE NAME OR THE CODE OF THE PRODUCT FROM THE UPLOADED FILE
        const filter = {
         CODE2: data.CODE2  
        };


        //IF THE PRODUCT EXIST IN SOFTONE THEN UPDATE THE PRODUCT  
       
      
        const find = await SoftoneProduct.findOne(filter);
     
        if(find) {
            if(find.MTRL) {
                //if you find MTRL it means that the product is in softone and you need to update the prices:
                let MTRL = find.MTRL
                console.log('MTRL')
                console.log(MTRL)
                await updateSoftone(MTRL)

            }
            let product = await SoftoneProduct.findOneAndUpdate(filter, {
                $set: productData,
            },
                { new: true, }
            );
           
            //UPDATE THE STATUS TO UPDATED
            await UploadedProduct.findOneAndUpdate({ _id: uploadedProduct._id }, {
                $set: {
                        STATUS: product ?  'updated' : 'Αποτυχία update προϊόντος',
                        NEW: false
                    }
                })

        }

        if (!find) {
            let product = await SoftoneProduct.create(productData);
            //UPDATE THE STATUS TO CRATED
            await UploadedProduct.findOneAndUpdate({ _id: uploadedProduct._id }, {
                $set: {
                        STATUS: product ?  'created' : 'Αποτυχία εισαγωγής στην βάση',
                        NEW: true
                    }
                })

          
            

        }
        
        
        async function updateSoftone(MTRL) {
            await UploadedProduct.findOneAndUpdate({ _id: uploadedProduct._id }, {
                $set: {
                    SHOULD_UPDATE_SOFTONE: true,
                }
            })
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/updateMtrlPrice`;
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                    MTRL: MTRL,
                    PRICER: productData.PRICER,
                    PRICEW: productData.PRICEW,
                    PRICE01: productData.PRICER01,
                })
            });
            let responseJSON = await response.json();
          
            await UploadedProduct.findOneAndUpdate({ _id: uploadedProduct._id }, {
                $set: {
                    UPDATED_SOFTONE: responseJSON.success ? true : false,
                }
            })
        }
        return res.status(200).json({ success: true, name: data.NAME });
    } catch (e) {
        return res.status(500).json({ success: false, error: "Αποτυχία εισαγωγής στην βάση" });
    }

}