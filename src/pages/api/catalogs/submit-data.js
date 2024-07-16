export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};

import connectMongo from "../../../../server/config";
import SoftoneProduct from "../../../../server/models/newProductModel";
import { removeEmptyObjectFields } from "@/utils/removeEmptyObjectFields";
export default async function handler(req, res) {
  const { data, brand } = req.body;
  await connectMongo();

  const SOFTONE_ARRAY = [];
  let system_data = [];
  let softoneStatus = false;
  let should_update_softone = 0;
  let should_update_system = 0;
  let should_create = 0;
  let update_system = 0;
  let create_system = 0;
    try {
      for (let product of data) {
        let result = {};
        result.code = product?.CODE2;
        const { SOFTONE_DATA, PRODUCT_DATA } = createData(product, brand);
        //SEARCH IF PRODUCT EXISTS:
        const find = await findProduct(PRODUCT_DATA);
        result.name = find?.NAME || product.NAME;
        //PRODUCT IS FOUND:
        if (find) {
          //UPDATE SYSTEM:
          should_update_system++;
          result.status = "update";
          let updatedProduct = await updateProduct(product);
          if (updatedProduct) {
            update_system++;
            result.success = true;
            result.message = "Έγινε update στο σύστημα";
            if (find.MTRL) {
              result.MTRL = find.MTRL;
              result.softone = "updated";
              result.message += " και στο Softone";
              SOFTONE_DATA.MTRL = find.MTRL;
              SOFTONE_ARRAY.push(SOFTONE_DATA);
              should_update_softone++;
            }
          } else {
            result.success = false;
            result.message = "Αποτυχία update στο σύστημα";
          }
        } else {
          should_create++;
          let createdProduct = await SoftoneProduct.create({
            ...PRODUCT_DATA ,
            ISACTIVE: true,
          });
          result.status = "create";
          if (createdProduct) {
            create_system++;
            result.success = true;
            result.message = "Το προϊόν δημιουργήθηκε με επιτυχία";
          } else {
            result.success = false;
            result.message = "Αποτυχία δημιουργίας";
          }
        }
        system_data.push(result);
      }
    
      let softoneUpdateResponse = await updateSoftone(SOFTONE_ARRAY);
      softoneStatus = softoneUpdateResponse.success;
      return res.status(200).json({
        system_data,
        softoneStatus,
        should_update_softone,
        should_update_system,
        should_create,
        update_system,
        create_system,
        success: true,
        message: "Η διαδικασία ολοκληρώθηκε επιτυχώς."
      });
    } catch(e) {
        return res.status(400).json({
          success: false,
          message: e.message
        })
    }
}

async function findProduct(product) {
  try {
    return await SoftoneProduct.findOne(
      { CODE2: product.CODE2 },
      { _id: 1, MTRL: 1, NAME: 1, ISACTIVE: 1 }
    );
  } catch (e) {
    throw new Error(`Error finding product: ${e.message}`);
  }
}

async function updateProduct(product) {
  try {
    return await SoftoneProduct.findOneAndUpdate(
      { CODE2: product.CODE2 },
      { $set: {
        ...product,
        ISACTIVE: true,
      } },
      { new: true }
    );
  } catch (e) {
    throw new Error(`Error updating product: ${e.message}`);
  }
}

async function updateSoftone(data) {
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
    throw new Error(`Error updating Softone: ${error.message}`);
  }
}

function createData(item, brand) {
  const common = {
    NAME: item?.NAME,
    VAT: item?.VAT,
    CODE: item?.CODE?.toString(),
    CODE1: item?.CODE1?.toString(),
    CODE2: item?.CODE2?.toString(),
    GWEIGHT: item?.GWEIGHT?.toString(),
    WEIGHT: item?.WEIGHT?.toString(),
    VOLUME: item?.VOLUME?.toString(),
    PRICER: item?.PRICER,
    PRICEW: item?.PRICEW,
    PRICE02: item?.PRICE02,
    INTRASTAT: item?.INTRASTAT,
    VAT: item?.VAT,

  };

  const softone = {
    ...common,
    SKROUTZ: item?.isSkroutz,
    DIM1: item?.WIDTH?.toString(),
    DIM2: item?.HEIGHT?.toString(),
    DIM3: item?.LENGTH?.toString(),
  };

  const product = {
    ...common,
    isSkroutz: item?.isSkroutz,
    COST: item?.COST,
    WIDTH: item?.WIDTH?.toString(),
    HEIGHT: item?.HEIGHT?.toString(),
    LENGTH: item?.LENGTH?.toString(),
    MTRMARK: brand?.MTRMARK,
    MTRMARK_NAME: brand?.MTRMARK_NAME,
  };

  return {
    PRODUCT_DATA: removeEmptyObjectFields(product),
    SOFTONE_DATA: removeEmptyObjectFields(softone),
  };
}
