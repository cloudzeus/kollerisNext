import axios from "axios";

import {
  MtrGroup,
  MtrCategory,
  SubMtrGroup,
} from "../../../../server/models/categoriesModel";
import connectMongo from "../../../../server/config";
import { ca, enGB, is } from "date-fns/locale";
import translateData from "@/utils/translateDataIconv";

export default async function handler(req, res) {
  await connectMongo();
  ///handler for softone catergories
  let action = req.body.action;
  if (action === "findAll") {
    try {
      await connectMongo();
      let categories = await MtrCategory.find({}).populate({
        path: "groups",
        populate: { path: "subGroups" },
      });
      return res.status(200).json({ success: true, result: categories });
    } catch (e) {
      return res.status(400).json({ success: false, result: null });
    }
  }

  if (action === "create") {
    let { englishName, categoryName, categoryIcon, categoryImage } = req.body;
    try {
      let addedSoftone = await fetch(
        `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrCategory/createMtrCategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "Service",
            password: "Service",
            name: categoryName,
            isactive: 1,
          }),
        }
      );
      let buffer = await translateData(addedSoftone);
      if (!buffer) throw new Error(buffer?.error);
      const category = await MtrCategory.create({
        categoryName,
        englishName,
        categoryIcon,
        categoryImage,
        softOne: {
          MTRCATEGORY: buffer?.kollerisPim?.MTRCATEGORY,
          CODE: buffer.kollerisPim.CODE,
          NAME: categoryName,
          ISACTIVE: 1,
        },
        status: true,
      });
      if (!category)
        throw new Error("Αποτυχία δημιουργίας στην βάση δεδομένων");
      return res
        .status(200)
        .json({ success: true, message: "Επιτυχής προσθήκη στην βάση" });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.response?.data || error.message,
      });
    }
  }

  if (req.method === "PUT" && action === "putCategory") {
    const { mtrcategory, categoryName, updatedFrom, englishName, id } =
      req.body;
    try {
      let softone = await fetch(
        `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrCategory/updateMtrCategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "Service",
            password: "Service",
            mtrcategory: mtrcategory,
            code: mtrcategory.toString(),
            name: categoryName,
            company: 1001,
          }),
        }
      );
      let buffer = await translateData(softone);
      if (!buffer.success) {
        throw new Error(buffer.error);
      }

      await connectMongo();
      const updatecategory = await MtrCategory.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            categoryName,
            englishName,
            updatedFrom,
          },
        },
        { new: true }
      );
      if (!updatecategory) {
        throw new Error("Αποτυχία update στο MongoDB");
      }

      return res.status(200).json({
        success: true,
        message: "Επιτυχής ενημέρωση!",
        result: updatecategory,
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: e.response?.data || e.message,
      });
    }
  }

  if (req.method === "PUT" && action === "putImage") {
    const { update, id } = req.body;
    try {
      await connectMongo();
      let updated = await MtrCategory.findOneAndUpdate(
        { _id: id },
        {
          $set: update,
        }
      );
      return res.status(200).json({
        success: true,
        message: "Eπιτυχής προσθήκη στην βάση",
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }

  if (action === "addImage") {
    const { imageName, id } = req.body;
    try {
      await connectMongo();
      let add = await MtrCategory.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            categoryImage: imageName,
          },
        }
      );

      return res.status(200).json({ success: true, result: add });
    } catch (e) {
      return res.status(400).json({ success: false, result: null });
    }
  }
}
