import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import Clients from "../../../../server/models/modelClients";
import SingleOffer from "../../../../server/models/singleOfferModel";
import Holders from "../../../../server/models/holderModel";
import { removeEmptyObjectFields } from "@/utils/removeEmptyObjectFields";
export default async function handler(req, res) {
  const action = req.body.action;
  await connectMongo();

  if (req.method === "POST" && action === "addClient") {
    

    // THIS DOES NOT WORK BECAUSE THE SOFTONE API DOES NOT ACCEPT THE DATA IN THIS FORMAT
    const {
        TRDR,
        CODE,
        NAME,
        AFM,
        ADDRESS,
        PHONE01,
        PHONE02,
        DIASCODE,
        EMAIL,
        ZIP,
        COUNTRY,
        SOCURRENCY
      } = req.body;


    let removeUndefined = removeEmptyObjectFields({
        TRDR,
        CODE: CODE,
        NAME: NAME,
        AFM,
        ADDRESS,
        DIASCODE,
        PHONE01,
        PHONE02,
        EMAIL,
        ZIP,
        COUNTRY: COUNTRY,
        SOCURRENCY,
    });
    try  {
      const result = await fetch(`${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.trdr/insertSupplier`, {
        method: "POST",
        body: JSON.stringify({
          username: "Service",
          password: "Service",
          SODTYPE: 13,
          COMPANY: 1001,
          removeUndefined
        }),
      });
      let buffer = await translateData(result);
      if (!buffer.success) throw new Error(buffer.error);
      if(buffer.success) {
        let result = await Clients.create({
            ...removeUndefined,
            TRDR: buffer.TRDR,
            OFFERSTATUS: false,
          });
        if(!result) throw Error("Ο πελάτης δεν δημιουργήθηκε"

        )

      }
      return res.status(200).json({
        success: true,
        message: "Ο πελάτης δημιουργήθηκε επιτυχώς",
      })
    } catch (e) {
       
      return res.status(400).json({
        success: false,
        error: e.message,
      });
    }
  }

  if (req.method === "PUT" && action === "updateOne") {
    const {
      SOCURRENCY,
      TRDR,
      CODE,
      NAME,
      AFM,
      ADDRESS,
      PHONE01,
      PHONE02,
      COUNTRY,
      DIASCODE,
      EMAIL,
      ZIP,
      id,
    } = req.body;
    //CREATE DATA OBJECT:
    const removeUndeFined = removeEmptyObjectFields({
        TRDR: TRDR,
        CODE: CODE,
        NAME: NAME,
        COUNTRY: COUNTRY,
        AFM: AFM,
        ADDRESS: ADDRESS,
        SOCURRENCY: SOCURRENCY,
        PHONE01: PHONE01,
        PHONE02: PHONE02,
        EMAIL: EMAIL,
        ZIP: ZIP,

    });
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.trdr/updateSupplier`,
        {
          method: "POST",
          body: JSON.stringify({
            username: "Service",
            password: "Service",
            SODTYPE: 13,
            COMPANY: 1001,
            ...removeUndeFined,
          }),
        }
      );
      
      let buffer = await translateData(result);
      if (!buffer) throw new Error(buffer.error);
      if (buffer.success) {
        let insert = await Clients.findOneAndUpdate(
          { _id: id },
          { $set: {
            TRDR: TRDR,
            CODE: CODE,
            NAME: NAME,
            AFM: AFM,
            COUNTRY: COUNTRY,
            ADDRESS: ADDRESS,
            PHONE01: PHONE01,
            PHONE02: PHONE02,
            EMAIL: EMAIL,
            ZIP: ZIP,
            DIASCODE: DIASCODE
          }  

          },
          { new: true }
        );
        if (!insert) throw new Error("Ο πελάτης δεν ενημερώθηκε");
      }
      return res.status(200).json({ 
        success: true,
        message: "Ο πελάτης ενημερώθηκε επιτυχώς",
    });
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: e.message,
      });
    }
  }
  //USE IN THE GLOBAL CUSTOMERS TABLE WHERE YOU SELECT A CUSTOMER:
  if (action === "fetchAll") {
    const { skip, limit, searchTerm, sortOffers } = req.body;
    try {
      let totalRecords;
      let clients;
      if (
        !searchTerm.afm &&
        !searchTerm.name &&
        !searchTerm.address &&
        !searchTerm.phone01 &&
        !searchTerm.phone02 &&
        !searchTerm.email
      ) {
        totalRecords = await Clients.countDocuments({});
        clients = await Clients.find({}).skip(skip).limit(limit);
      }
      if (searchTerm?.name) {
        let name = searchTerm.name.replace(/[^a-zA-Z0-9_]/g, "");
        let regexSearchTerm = new RegExp(name, "i");
        totalRecords = await Clients.countDocuments({ NAME: regexSearchTerm });
        clients = await Clients.find({ NAME: regexSearchTerm })
          .skip(skip)
          .limit(limit);
      }
      if (searchTerm?.phone01) {
        let regexSearchTerm = new RegExp(searchTerm?.phone01, "i");
        totalRecords = await Clients.countDocuments({
          PHONE01: regexSearchTerm,
        });
        clients = await Clients.find({ PHONE01: regexSearchTerm })
          .skip(skip)
          .limit(limit);
      }
      if (searchTerm?.phone02) {
        let regexSearchTerm = new RegExp(searchTerm?.phone02, "i");
        totalRecords = await Clients.countDocuments({
          PHONE02: regexSearchTerm,
        });
        clients = await Clients.find({ PHONE02: regexSearchTerm })
          .skip(skip)
          .limit(limit);
      }
      if (searchTerm?.afm) {
        let regexSearchTerm = new RegExp(searchTerm.afm, "i");
        totalRecords = await Clients.countDocuments({ AFM: regexSearchTerm });
        clients = await Clients.find({ AFM: regexSearchTerm })
          .skip(skip)
          .limit(limit);
      }
      if (searchTerm?.address) {
        let regexSearchTerm = new RegExp(searchTerm.address, "i");
        totalRecords = await Clients.countDocuments({
          ADDRESS: regexSearchTerm,
        });
        clients = await Clients.find({ ADDRESS: regexSearchTerm })
          .skip(skip)
          .limit(limit);
      }
      if (searchTerm?.email) {
        let regexSearchTerm = new RegExp(searchTerm.email, "i");
        totalRecords = await Clients.countDocuments({ EMAIL: regexSearchTerm });
        clients = await Clients.find({ EMAIL: regexSearchTerm })
          .skip(skip)
          .limit(limit);
      }

      if (sortOffers !== 0 && sortOffers !== undefined) {
        clients = await Clients.find({})
          .sort({ OFFERSTATUS: sortOffers })
          .skip(skip)
          .limit(limit);

        totalRecords = await Clients.countDocuments({});
      }

      return res
        .status(200)
        .json({ success: true, result: clients, totalRecords: totalRecords });
    } catch (e) {
      return res.status(400).json({ success: false });
    }
  }
}
