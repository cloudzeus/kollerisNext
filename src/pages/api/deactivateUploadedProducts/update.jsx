import SoftoneProduct from "../../../../server/models/newProductModel";
import connectMongo from "../../../../server/config";
import { deleteBunny } from "@/utils/bunny_cdn";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};
export default async function handler(req, res) {
  if (req.method !== "PUT") {
    response.message = "Method not allowed";
    return res.status(405).json(response);
  }
  await connectMongo();
  const { data, mongoKeys } = req.body;
  let results = [];
  let softoneResponse = null;
  let message = "";
  //1)CHECK FOR STOCK - AVAILABILITY:
  try {
    const SOFTONE_PRODUCT_QUEUE = [];
    for (let product of data) {
      let result = {};
      result.code = product[mongoKeys.mappingKey.key];
      const productExists = await findProduct(
        product,
        mongoKeys.mappingKey.key
      );

      //PRODUCT EXISTS AND AVAILABILITY IS ZERO: -> DEACTIVATE ON BOTH SYSTEMS:
      if (productExists && productExists.availability?.DIATHESIMA === "0") {
        	result.name = productExists?.NAME;
          result.shouldDelete = true;
        //STEP 1//: PLACE IT IN SOFTONE QUE:
        if (productExists.MTRL) {
          SOFTONE_PRODUCT_QUEUE.push({
            MTRL: productExists.MTRL,
            ISACTIVE: false,
          });
          result.MTRL = productExists.MTRL;
          result.deactivatedSoftone = true;
        } else {
          result.deactivatedSoftone = false;
        }

        //STEP 2//: DELETE IMAGES FROM BUNNY CDN:
        if (productExists?.images && productExists?.images?.length > 0) {
          result.hasImages = true;
          let imagesDelete = await deleteImages(productExists.images);
          if (imagesDelete.success) {
            result.imagesDeletedStatus = true;
          } else {
            result.imagesDeletedStatus = false;
          }
        } else {
          result.hasImages = false;
        }

       //STEP 3://DELETE PRODUCT FROM SYSTEM:
        const deleteOnSystem = await deleteSystem(productExists._id);
        if (deleteOnSystem) {
          result.systemDelete = true;
        } else {
          result.systemDelete = false;
        }
      } 

      //PRODUCT HAS AVAILABILITY -> SHOULD NOT BE DELETED
      if(productExists && productExists.availability?.DIATHESIMA !== "0"){
        result.name = productExists?.NAME;
        result.deactivatedSoftone = false;
        result.shouldDelete = false;
        result.systemDelete = false;
        result.message = "Υπάρχει διαθεσιμότητα";
      } 
      //NO PRODUCT:
      if(!productExists) {
        result.code = product[mongoKeys.mappingKey.key];
        result.name = "Δεν βρέθηκε";
        result.deactivatedSoftone = false;
        result.shouldDelete = false;
        result.systemDelete = false;
      }
      results.push(result);
    }

    //SEND ALL PRODUCTS TO SOFTONE FOR DEACTIVATION:
    const deactivate = await deactivateSoftone(SOFTONE_PRODUCT_QUEUE);
    softoneResponse = deactivate;
    return res.status(200).json({
      result: results,
      softoneResponse,
      message,
      success: true,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}

async function findProduct(product, code) {
  try {
    return await SoftoneProduct.findOne(
      { [code]: product[code] },
      {
        availability: 1,
        MTRL: 1,
        _id: 1,
        NAME: 1,
        images: 1,
      }
    );
  } catch (e) {
    throw new Error(e.message);
  }
}

async function deleteSystem(id) {
  try {
    let updateSystem = await SoftoneProduct.deleteOne(id);
    if (updateSystem && updateSystem.deletedCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    throw new Error(e.message);
  }
}

async function deactivateSoftone(data) {
  let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl2/update`;
  try {
    let result = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "Service",
        password: "Service",
        data: data,
      }),
    });

    let resJson = await result.json();
    return resJson;
  } catch (error) {
    console.error(`Error updating Softone: ${error.message}`);
    throw new Error(`Error updating Softone: ${error.message}`);
  }
}

async function deleteImages(images) {
  try {
    for (let image of images) {
      let bunny = await deleteBunny(image?.name);
    }
    return {
      success: true,
      message: "Images deleted from Bunny CDN",
    };
  } catch (e) {
    return {
      success: false,
      message: e.message,
    };
  }
}
