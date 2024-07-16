

import {
  MtrGroup,
  MtrCategory,
} from "../../../../server/models/categoriesModel";
import connectMongo from "../../../../server/config";
import translateData from "@/utils/translateDataIconv";
import { createSoftoneGroup } from "@/utils/softone";
export default async function handler(req, res) {
  ///handler for softone catergories
  let action = req.body.action;

  if (action === "findAll") {
    try {
      await connectMongo();
      const mtrgroup = await MtrGroup.find({})
        .populate({
          path: "category",
        })
        .populate({
          path: "subGroups",
        });

      return res.status(200).json({ success: true, result: mtrgroup });
    } catch (e) {
      return res.status(400).json({ success: false, result: null });
    }
  }
 
  if (action === "create") {
    try {
      await connectMongo();
      const {
        MTRCATEGORY,
        groupName,
        englishName,
        groupImage,
        groupIcon,
      } = req.body;

	
      let addedSoftone = await createSoftoneGroup(groupName, MTRCATEGORY);
      if (!addedSoftone.success) {
        throw new Error(addedSoftone.error);
      }

      const category = await MtrCategory.findOne(
        { "softOne.MTRCATEGORY": MTRCATEGORY },
        { _id: 1 }
      );
      const MTRGROUP = addedSoftone?.kollerisPim?.MTRGROUP;
      const group = await MtrGroup.create({
        category: category._id,
        groupName,
        englishName,
        groupImage,
        groupIcon,
        softOne: {
          MTRGROUP: MTRGROUP,
          CODE: MTRGROUP.toString(),
          NAME: groupName,
          ISACTIVE: 1,
        },
        status: true,
      });

      if (!group) {
        throw new Error("Αποτυχία εισαγωγής της ομάδας στην βάση δεδομένων");
      }
      const updateCategories = await MtrCategory.findOneAndUpdate(
        { _id: category._id },
        {
          $push: {
            groups: group._id,
          },
        }
      );
      if (!updateCategories) {
        throw new Error(
          "Αποτυχία ενημέρωσης της κατηγορίας στην βάση δεδομένων"
        );
      }
      return res.status(200).json({
        success: true,
        result: group,
        message: "Επιτυχής εισαγωγή στην βάση δεδομένων",
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
  if (req.method === "PUT" && action === "putGroups") {
    await connectMongo();
    const {
      groupName,
      englishName,
      groupName_og,
      MTRCATEGORY_UPDATE,
      MTRCATEGORY_ORIGINAL,
      MTRCATEGORY_ORIGINAL_ID,
      MTRGROUP_ORIGINAL,
      groupid,
      updatedFrom,
    } = req.body;
    
    
    try {
      let { _id } = await MtrCategory.findOne(
        { "softOne.MTRCATEGORY": MTRCATEGORY_UPDATE },
        { _id: 1 }
      );
      let newcategoryId = _id; // => { _id: new ObjectId("6653404913126f012bf5934c") }
      if (
        MTRCATEGORY_UPDATE !== MTRCATEGORY_ORIGINAL ||
        groupName !== groupName_og
      ) {
        //if the name, or the parent category changes update softone:
       let softoneUpdate = await updateSoftoneGroup(
          MTRGROUP_ORIGINAL, // find by group
          groupName, // update group name
          MTRCATEGORY_UPDATE // update category
        );
        if (!softoneUpdate.success) throw new Error(softoneUpdate.error);
      }
      //if the category changes:
      if (MTRCATEGORY_UPDATE !== MTRCATEGORY_ORIGINAL) {
        //push group to new category, and pull form old category
        let resultCategories = await pullAndPushCategories(
          newcategoryId,
          MTRCATEGORY_ORIGINAL_ID,
          groupid
        );
        if (!resultCategories.success) throw new Error(resultCategories.error || "Αποτυχία ενημέρωσης της κατηγορίας στην βάση δεδομένων");
      }
      const updateMongo = await MtrGroup.findOneAndUpdate(
        { _id: groupid },
        {
          $set: {
            category: newcategoryId,
            groupName: groupName,
            englishName: englishName,
            updatedFrom: updatedFrom,
            "softOne.NAME": groupName,
            "softOne.MTRCATEGORY": MTRCATEGORY_UPDATE,
          },
        }
      );

      if(!updateMongo) throw new Error("Αποτυχία ενημέρωσης της ομάδας στην βάση δεδομένων");
      return res.status(200).json({
        success: false,
        message: "Επιτυχής ενημέρωση στην βάση δεδομένων",
      })
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: e.message,
      });
    }
  
  }

  if (req.method === "PUT" && action === "putImage") {
    const { update, id } = req.body;
    try {
      await connectMongo();
      let updated = await MtrGroup.findOneAndUpdate(
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

}

//--------- FUNCTIONS ---------:

//push group to new category, and pull form old category
async function pullAndPushCategories(
  findCategoryId,
  findOriginalCategoryId,
  groupid
) {
  //PULL THE GROUP FROM THE OLD CATEGORY
  try {
    await MtrCategory.updateOne(
      { _id: findCategoryId },
      { $push: { groups: groupid } }
    );
  } catch {
    return {
      error: "failed to pull the group from the old category",
      success: false,
    };
  }
  //PUSH THE GROUP TO THE NEW CATEGORY
  try {
    await MtrCategory.updateOne(
      { _id: findOriginalCategoryId },
      { $pull: { groups: groupid } }
    );
  } catch {
    return {
      error: "failed to push the group to the new category",
      success: false,
    };
  }
  return {
    message: "Επιτυχής ενημέρωση",
    success: true,
  };
}

//update softone
async function updateSoftoneGroup(MTRGROUP_ORIGINAL,groupName,MTRCATEGORY_UPDATE,
) {  
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrGroup/updateMtrGroup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Service",
          password: "Service",
          company: 1001,
          code: MTRGROUP_ORIGINAL?.toString(),
          mtrgroup: MTRGROUP_ORIGINAL,
          name: groupName,
          mtrcategory: MTRCATEGORY_UPDATE,
        }),
      }
    );
    let buffer = await translateData(res);
    return buffer;
}
