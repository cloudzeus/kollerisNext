
import { connect } from "mongoose";
import connectMongo from "../../../server/config";
import SoftoneProduct from "../../../server/models/newProductModel";
import { ConnectedOverlayScrollHandler } from "primereact/utils";
import UploadedProduct from "../../../server/models/uploadedProductsModel";
export default async function handler(req, res) {
    const { data, SUPPLIER_NAME, UNIQUE_CODE } = req.body;
    
    console.log('=----------------------------------------')
    console.log(UNIQUE_CODE)
    try {
        await connectMongo();
        let productData = {
            DESCRIPTION: data?.description || '',
            NAME: data.NAME,
            SOFTONESTATUS: false,
            COUNTRY: data?.COUNTRY || '',
            VAT: data?.VAT || '',
            CODE1: data?.CODE1 || '',
            CODE2: data?.CODE2 || '',
            PRICER: data.PRICER,
            PRICEW: data.PRICEW,
            COST: parseFloat(data.COST.toFixed(2)),
            PRICER05: data.PRICER05,
            WIDTH: data?.WIDTH || '',
            HEIGHT: data?.HEIGHT || '',
            LENGTH: data["ΠΛΑΤΟΣ"] || '',
            hasImage: false,
            uploaded: true,
            // uploadedDate: 
        }
        //CREATE THE UPLOADED PRODUCT FOR THIS SUPPLIER
        let uploadedProduct = await UploadedProduct.create({
            NAME: data.NAME,
            EANCODE: data.EANCODE,
            PRICER: data.PRICER,
            PRICEW: data.PRICEW,
            COST: parseFloat(data.COST.toFixed(2)),
            PRICER05: data.PRICER05,
            SUPPLIER_NAME: SUPPLIER_NAME,
            SUPPLER_TRDR: data.SUPPLER_TRDR,
            UNIQUE_CODE:  UNIQUE_CODE,
        })
        //CREATE A FILTER WITH EITHER THE NAME OR THE CODE OF THE PRODUCT FROM THE UPLOADED FILE
        const filter = {
         CODE1: data.CODE1 
        };


        //IF THE PRODUCT EXIST IN SOFTONE THEN UPDATE THE PRODUCT  
       
          

          



     
      
        const find = await SoftoneProduct.findOne(filter);
      
        if(find) {
            if(find.MTRL) {
                //if you find MTRL it means that the product is in softone and you need to update the prices:
                let MTRL = find.MTRL
                await updateSoftone(MTRL)

            }
            let product = await SoftoneProduct.findOneAndUpdate(filter, {
                $set: productData,
            },
                { new: true, }
            );
            // console.log('updatedProduct')
            // console.log(product)
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
            // console.log('created Product')
            // console.log(product)
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
            let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/updateMtrl`;
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                    PRICER: productData.PRICER,
                    PRICEW: productData.PRICEW,
                    PRICER05: productData.PRICER05, //TIMH SCROUTZ
                    MTRL: MTRL

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