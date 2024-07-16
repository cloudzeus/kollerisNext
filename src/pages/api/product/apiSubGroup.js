import {
  MtrGroup,
  SubMtrGroup,
} from "../../../../server/models/categoriesModel";
import connectMongo from "../../../../server/config";
import translateData from "@/utils/translateDataIconv";
export default async function handler(req, res) {
  ///handler for softone catergories
  let action = req.body.action;
  await connectMongo();

  if (action === "findAll") {
    try {
      const subgroup = await SubMtrGroup.find({}).populate("group", {
        groupName: 1,
        softOne: 1,
      });

      return res.status(200).json({ success: true, result: subgroup });
    } catch (e) {
      return res.status(400).json({ success: false, result: null });
    }
  }

  if (action === "findGroupNames") {
    try {
      let categories = await MtrGroup.find(
        {},
        {
          _id: 0,
          label: "$groupName",
          value: { _id: "$_id", mtrgroup: "$softOne.MTRGROUP" },
        }
      );
      return res.status(200).json({ success: true, result: categories });
    } catch (e) {
      return res.status(400).json({ success: false, result: null });
    }
  }

  if (action === "create") {
    const { subGroupName, englishName, MTRGROUP, subGroupImage, subGroupIcon } =
      req.body;
    try {
      let softoneadd = await fetch(
        `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.cccGroup/createCccGroup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "Service",
            password: "Service",
            name: subGroupName,
            mtrgroup: MTRGROUP,
          }),
        }
      );
      //CREATE SOFTONE GROUP:
      let buffer = await translateData(softoneadd);
      if (!buffer) throw new Error(buffer.error);
      //FIND MONGO GROUPID:
      let findGroup = await MtrGroup.findOne({ "softOne.MTRGROUP": MTRGROUP });
      if (!findGroup) throw new Error("Αποτυχία εύρεσης ομάδας");
      //CREATE MONGO SUBGROUP:
      if (buffer) {
        let updateMongo = await SubMtrGroup.create({
          group: findGroup._id,
          subGroupName,
          englishName: englishName || "",
          subGroupIcon: subGroupIcon,
          subGroupImage: subGroupImage,
          softOne: {
            cccSubgroup2: buffer.kollerisPim.cccSubgroup2,
            short: buffer.kollerisPim.cccSubgroup2.toString(),
            name: subGroupName,
            MTRGROUP: MTRGROUP,
          },
        });
        if (!updateMongo)
          throw new Error("Αποτυχία δημιουργίας υποομάδας στην βάση δεδομένων");
      }

      return res.status(200).json({
        success: true,
        message: `Επιτυχής δημιουργία της υποομάδας ${subGroupName}`,
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: e.response?.data?.message || e.message,
      });
    }
  }

  if (req.method === "PUT" && action === "putSubgroup") {
    const {
      cccSubgroup2,
      short,
      subGroupName,
      englishName,
      MTRGROUP,
      MTRGROUP_OG,
      subgroupid,
      updatedFrom,
    } = req.body;
    try {
      let softoneResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.cccGroup/updateCccGroup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "Service",
            password: "Service",
            cccSubgroup2: cccSubgroup2,
            short: short,
            name: subGroupName,
            mtrgroup: MTRGROUP,
          }),
        }
      );
      let buffer = await translateData(softoneResponse);
      if (!buffer.success) throw new Error(buffer.error);

      let updateMongo = await SubMtrGroup.findOneAndUpdate(
        { _id: subgroupid },
        {
          $set: {
            updatedFrom,
            subGroupName,
            englishName: englishName || "",
            softOne: {
              name: subGroupName,
              MTRGROUP: MTRGROUP,
            },
          },
        }
      );
      if (MTRGROUP !== MTRGROUP_OG) {
        const pushNewGroup = await MtrGroup.findOneAndUpdate(
          { "softOne.MTRGROUP": MTRGROUP },
          { $push: { subGroups: subgroupid } }
        );
        if (!pushNewGroup) throw new Error("Αποτυχία προσθήκης στην νέα ομάδα");

        const pullOld = await MtrGroup.findOneAndUpdate(
          { "softOne.MTRGROUP": MTRGROUP_OG },
          { $pull: { subGroups: subgroupid } }
        );
        if (!pullOld) throw new Error("Αποτυχία αφαίρεσης από την παλιά ομάδα");
      }

      return res.status(200).json({
        success: true,
        message: `Επιτυχής ενημέρωση της υποομάδας ${subGroupName}`,
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: e.response?.data?.message || e.message,
      });
    }
  }

  //UPDATE IMAGES:
  if (req.method === "PUT" && action === "putImage") {
    const { update, id } = req.body;
    try {
      await connectMongo();
      const updatedsubGroup = await SubMtrGroup.findOneAndUpdate(
        { _id: id },
        update,
        { new: true }
      );
      if (!updatedsubGroup)
        throw new Error("Αποτυχία ενημέρωσης φωτογραφιών της υποομάδας");
      return res.status(200).json({
        success: true,
        message: "Επιτυχής ενημέρωση της υποομάδας",
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: e.response?.data?.message || e.message,
      });
    }
  }
}
