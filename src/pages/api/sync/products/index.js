import SoftoneProduct from "../../../../../server/models/newProductModel";
import Markes from "../../../../../server/models/markesModel";
import connectMongo from "../../../../../server/config";
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
  let action = req.body.action;


  if (req.method === 'POST' && action === 'getProducts' ) {
    await connectMongo();
    console.log('reqbody')
    console.log(req.body)
    let {category, brand, manufacturer, group, subgroup, name, erpcode, eancode,factorycode } = req.body;

    //Create and obj to filter for spesific conditions:
    let filterConditions = {};

    if(name) {
      filterConditions.NAME = new RegExp("^" + name, 'i');
    }
    //FILTER BY CATEGORY:
    if (category) {
      filterConditions.CATEGORY_NAME = category;
    }

    //FILTER BY GROUP:
    if (group) {
      filterConditions.GROUP_NAME = group;
    }
    if(subgroup) {
      filterConditions.SUBGROUP_NAME = subgroup;
    }
    //FILTER BY MANUFACTURER:
    if (manufacturer) {
      filterConditions.MMTRMANFCTR_NAME = manufacturer;
    }
    //FILTER BY ERP CODE:
    if (erpcode) {
      filterConditions.CODE= erpcode;
    }
    //FILTER BY EAN CODE:
    if (eancode) {
      filterConditions.CODE1 = eancode;
    }
    //FILTER BY CODE2:
    if (factorycode) {
      filterConditions.CODE2 = factorycode;
    }

    //FILTER BY BRAND:
    if(brand) {
      let brandData = await Markes.findOne({"softOne.NAME": brand}, {"softOne.MTRMARK": 1, _id: 0}).lean();
      let mark= brandData.softOne.MTRMARK
      filterConditions.MTRMARK = mark;
    } 


    try {
      let products = await SoftoneProduct.find(filterConditions).limit(100);
      if(!products.length) {
        response.result = products;
       
        response.success = true;
        response.message = 'No products where found with the given conditions';
      } else {
        response.result = products;
        response.count = products.length
        response.success = true;
        response.message = 'Products fetched successfully';
      }
  
     
    } catch (e) {
      response.error = e;
      response.success = false;
    
    }

    return res.status(200).json(response)
  }

  if (req.method === 'POST' && action === 'createProduct') {
    let response = {
      count: 0,
      error: null,
      success: false,
      message: 'request did not work',
      result: [],
    }


    await connectMongo();
    try {
      let product = req.body.product;
      console.log('product')
      console.log(product)
      let newProduct = await SoftoneProduct.create(product);
      response.result = newProduct;
      response.success = true;
      response.message = 'Product created successfully';
    } catch (e) {
      response.error = e;
      response.success = false;
      return res.status(500).json(response)
    }
    return res.status(200).json(response)
  }

   

}