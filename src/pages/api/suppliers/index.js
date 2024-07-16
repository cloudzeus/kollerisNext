import Supplier from "../../../../server/models/suppliersSchema";
import connectMongo from "../../../../server/config";
import translateData from "@/utils/translateDataIconv";
import PendingOrders from "../../../../server/models/pendingOrders";
import { removeEmptyObjectFields } from "@/utils/removeEmptyObjectFields";

export default async function handler(req, res) {
  const action = req.body.action;

  if (action === "fetchAll") {
    await connectMongo();

    const { skip, limit, searchTerm, sortOffers } = req.body;
    try {
      const filterConditions = {};
      if (searchTerm.afm)
        filterConditions.AFM = new RegExp(searchTerm.afm, "i");
      if (searchTerm.name)
        filterConditions.NAME = new RegExp(searchTerm.name, "i");
      if (searchTerm.phone01)
        filterConditions.PHONE01 = new RegExp(searchTerm.phone01, "i");
      if (searchTerm.phone02)
        filterConditions.PHONE02 = new RegExp(searchTerm.phone02, "i");
      if (searchTerm.email)
        filterConditions.EMAIL = new RegExp(searchTerm.email, "i");
      if (searchTerm.address)
        filterConditions.ADDRESS = new RegExp(searchTerm.address, "i");

      let query = Supplier.find(filterConditions);
      if (sortOffers !== 0) {
        query = query.sort({ ORDERSTATUS: sortOffers });
      } else {
        query = query.sort({ NAME: 1 });
      }
      let condition = Object.keys(filterConditions).length === 0;
      const totalRecords = await (condition
        ? Supplier.countDocuments()
        : Supplier.countDocuments(filterConditions));

      const suppliers = await query.skip(skip).limit(limit);
      return res
        .status(200)
        .json({ success: true, result: suppliers, totalRecords: totalRecords });
    } catch (e) {
      return res.status(400).json({ success: false });
    }
  }

  if(action === "findOne") {
    await connectMongo();
    const { id } = req.body;
    console.log({id})
    try {
      const supplier = await Supplier.findOne({TRDR: id})
        return res.status(200).json({success: true, result: supplier})
    } catch (e) {
        return res.status(400).json({success: false, error: e.message})
    }

  }
  if (action === "updateOne") {
    await connectMongo();

    const { data, user } = req.body;
    //  ACCETPED VALUES FOR SOFTONE UPDATE:
    let softoneObj = {
      TRDR: data.TRDR,
      EMAIL: data.EMAIL,
      EMAILACC: data.EMAILACC,
      AFM: data.AFM,
      NAME: data.NAME,
      PHONE01: data.PHONE01,
      PHONE02: data.PHONE02,
      ADDRESS: data.ADDRESS,
      ZIP: data.ZIP,
      CITY: data.CITY,
      COUNTRY: data?.COUNTRY?.COUNTRY,
      SOCURRENCY: data?.COUNTRY?.SOCURRENCY,
      TRDCATEGORY: data.TRDCATEGORY,
      BRANCH: data.BRANCH,
      IRSDATA: data.IRSDATA,
      JOBTYPE: data.JOBTYPE,
      ISACTIVE: data.ISACTIVE,
      CODE: data.CODE,
    };
    let removeUndefined = removeEmptyObjectFields(softoneObj);
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.trdr/updateSupplier`,
        {
          method: "POST",
          body: JSON.stringify({
            username: "Service",
            password: "Service",
            SODTYPE: 12,
            ...removeUndefined,
          }),
        }
      );
      let buffer = await translateData(result);
      if (!buffer.success) throw new Error(buffer.error);
      if (data?.minOrderValue) {
        let minOrder = await updateMinOrderValue(data.minOrderValue);
        if (!minOrder) throw new Error("Λάθος κατά την ενημέρωση της τιμής");
      }

      let updateSupplier = await Supplier.findOneAndUpdate(
        { _id: data._id },
        {
          ...softoneObj,
          minOrderValue: data.minOrderValue,
          updatedFrom: user,
        },
        { new: true }
      );
      if (!updateSupplier) {
        throw new Error("Λάθος κατά την ενημέρωση του προμηθευτή");
      }
      return res.status(200).json({
        success: true,
        message: "Ο προμηθευτής ενημερώθηκε επιτυχώς",
      });   
    } catch (e) {
        return res.status(400).json({
            success: false,
            error: e?.response?.data?.error || e.message,
        })
    }

    //when updating the supplier in case we update the minOrderValue in the supplier we need to update it in the pendingOrders collection
        async function updateMinOrderValue(minOrderValue) {
        let find = await PendingOrders.findOne({ supplierName: data.NAME });
        if(find) {
            return await PendingOrders.findOneAndUpdate(
                {
                supplierName: data.NAME,
                },
                {
                $set: {
                    minOrderValue: minOrderValue,
                },
                },
                { new: true }
            );
        } else {
            return true
        }
        }
  }

  if (action === "create") {
    await connectMongo();

    const { data } = req.body;
    let softoneObj = {
      TRDR: data.TRDR,
      TRDCATEGORY: data.TRDCATEGORY,
      SOCURRENCY: data.SOCURRENCY,
      CODE: data.CODE,
      EMAIL: data.EMAIL,
      EMAILACC: data.EMAILACC,
      AFM: data.AFM,
      NAME: data.NAME,
      PHONE01: data.PHONE01,
      PHONE02: data.PHONE02,
      ADDRESS: data.ADDRESS,
      ZIP: data.ZIP,
      CITY: data.CITY,
      COUNTRY: data.COUNTRY,
      BRANCH: data.BRANCH,
      IRSDATA: data.IRSDATA,
      JOBTYPE: data.JOBTYPE,
      ISACTIVE: data.ISACTIVE,
    };
    let payload = removeEmptyObjectFields(softoneObj);
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.trdr/insertSupplier`,
        {
          method: "POST",
          body: JSON.stringify({
            username: "Service",
            password: "Service",
            COMPANY: 1001,
            SODTYPE: 12,
            ...payload,
          }),
        }
      );
      let buffer = await translateData(result);
      if (!buffer.success) throw new Error(buffer.error);
      let find = await Supplier.findOne({ TRDR: buffer.TRDR });
      if (find) {
        return res.status(200).json({
          success: false,
          message: `Ο προμηθευτής με TRDR ${buffer.TRDR} υπάρχει ήδη`,
        });
      }
      //INSERT SUPPLIER IF NOT FOUND:
      let insert = await Supplier.create({
        ...data,
        TRDR: buffer.TRDR,
      });
      if (!insert) throw new Error("Λάθος κατά τη δημιουργία του χρήστη");
      return res.status(200).json({
        success: true,
        message: "Ο προμηθευτής δημιουργήθηκε επιτυχώς",
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: e?.response?.data?.error || e.message,
      });
    }
  }

  if (action === "saveCatalog") {
    await connectMongo();
    const { catalogName, id } = req.body;

    try {
      let result = await Supplier.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            catalogName: catalogName,
          },
        }
      );
      return res.status(200).json({ success: true, result: result });
    } catch (e) {
      return res.status(400).json({ success: false });
    }
  }

  if (action === "findSuppliersBrands") {
    await connectMongo();
    const { supplierID } = req.body;

    try {
      let result = await Supplier.findOne(
        {
          _id: supplierID,
        },
        { brands: 1 }
      ).populate("brands");

      console.log({result})

      return res.status(200).json({ success: true, result: result });
    } catch (e) {
      return res.status(400).json({ success: false, result: null });
    }
  }

  if (action === "deleteBrandFromSupplier") {
    const { supplierID, brandID } = req.body;

    try {
      let result = await Supplier.findOneAndUpdate(
        { _id: supplierID },
        {
          $pull: {
            brands: brandID,
          },
        }
      );
      return res.status(200).json({ success: true, result: result });
    } catch (e) {
      return res.status(400).json({ success: false });
    }
  }

  if (action === "getTRDCATEGORIES") {
    let send = {
      result: null,
      success: false,
      error: null,
      message: "",
    };
    try {
      let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAllTrdCategory`;
      const response = await fetch(URL, {
        method: "POST",
        body: JSON.stringify({
          username: "Service",
          password: "Service",
          sodtype: 12,
          company: 1001,
        }),
      });
      let buffer = await translateData(response);
      if (!buffer) {
        send.success = false;
        send.message = "No data found";
        return res.status(200).json(send);
      }
      send.success = true;
      send.result = buffer.result;
      return res.status(200).json(send);
    } catch (e) {
      return res.status(400).json({ success: false });
    }
  }
  if (action === "getCountries") {
    let send = {
      result: null,
      success: false,
      error: null,
      message: "",
    };
    try {
      let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAllCountries`;
      const response = await fetch(URL, {
        method: "POST",
        body: JSON.stringify({
          username: "Service",
          password: "Service",
        }),
      });
      let buffer = await translateData(response);
      if (!buffer) {
        send.success = false;
        send.message = "No data found";
        return res.status(200).json(send);
      }
      send.success = true;
      send.result = buffer.result;
      return res.status(200).json(send);
    } catch (e) {
      send.error = e;
      send.message = "Error fetching data";
      return res.status(400).json(send);
    }
  }
}
