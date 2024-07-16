import connectMongo from "../../../../server/config";
import axios from "axios";
import Markes from "../../../../server/models/markesModel";
import { format } from "path";
import Supplier from "../../../../server/models/suppliersSchema";
import translateData from "@/utils/translateDataIconv";
import { error } from "console";

export default async function handler(req, res) {
  let action = req.body.action;

  if (!action)
    return res
      .status(400)
      .json({ success: false, error: "no action specified" });

  if (action === "findOne") {
	await connectMongo();

    try {
      const markes = await Markes.find({ _id: req.body.id });
      if (markes) {
        return res.status(200).json({ success: true, markes: markes });
      } else {
        return res.status(200).json({ success: false, markes: null });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "failed to fetch Markes",
        markes: null,
      });
    }
  }

  if (action === "findAll") {
    try {
      await connectMongo();
      const markes = await Markes.find({}).populate("catalogs");
      if (markes.length) {
        const arrayImages = [];
        for (let item of markes) {
          for (let image of item?.photosPromoList ?? []) {
            if (image?.photosPromoUrl) {
              arrayImages.push(image?.photosPromoUrl);
            }
          }
        }
        return res
          .status(200)
          .json({ success: true, markes: markes, images: arrayImages });
      } else {
        return res.status(200).json({ success: false, markes: null });
      }
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error: "failed to fetch user" });
    }
  }

  if (action === "create") {
	await connectMongo();

    const { data } = req.body;
    try {
      const softoneResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrMark/createMtrMark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "Service",
            password: "Service",
            company: "1001",
            sodtype: "51",
            name: data.name,
          }),
        }
      );
      let buffer = await translateData(softoneResponse);
      if (!buffer) throw new Error(buffer.error);
      const SOFTONE_MTRMARK = buffer.kollerisPim.MTRMARK;

      const newMarkes = await Markes.create({
        description: data.description,
        logo: data.logo,
        videoPromoList: data.videoPromoList,
        photosPromoList: data.photosPromoList,
        pimAccess: {
          pimUrl: data.pimUrl,
          pimUserName: data.pimUserName,
          pimPassword: data.pimPassword,
        },
        webSiteUrl: data.webSiteUrl,
        officialCatalogueUrl: data.officialCatalogueUrl,
        facebookUrl: data.facebookUrl,
        instagramUrl: data.instagramUrl,
        softOne: {
          COMPANY: "1001",
          SODTYPE: "51",
          MTRMARK: parseInt(SOFTONE_MTRMARK),
          CODE: SOFTONE_MTRMARK.toString(),
          NAME: data.name,
          ISACTIVE: 1,
        },
        status: true,
        minValueOrder: data.minValueOrder,
        minItemsOrder: data.minItemsOrder,
        minYearPurchases: data.minYearPurchases,
      });
      if (!newMarkes) throw new Error("Αποτυχία εισαγωγής στη βάση δεδομένων");
      return res.status(200).json({
        success: true,
        message: "Επιτυχής εισαγωγή",
      });
    } catch (e) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }

  if (action === "update") {
	await connectMongo();

    const { mtrmark, id, data, oldName } = req.body;
    try {
      let buffer;

      //If the name of the mark has changed, update softone
      if (data?.name !== oldName) {
        let softoneResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrMark/updateMtrMark`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: "Service",
              password: "Service",
              company: "1001",
              sodtype: "51",
              mtrmark: mtrmark,
              name: data.name,
            }),
          }
        );
        buffer = await translateData(softoneResponse);
        if (!buffer) throw new Error(buffer.error);
      }
      const updateMongo = await Markes.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            description: data.description,
            updatedFrom: data.updatedFrom,
            videoPromoList: data.videoPromoList,
            photosPromoList: data.photosPromoList,
            pimAccess: {
              pimUrl: data.pimUrl,
              pimUserName: data.pimUserName,
              pimPassword: data.pimPassword,
            },
            webSiteUrl: data.webSiteUrl,
            officialCatalogueUrl: data.officialCatalogueUrl,
            facebookUrl: data.facebookUrl,
            instagramUrl: data.instagramUrl,
            "softOne.NAME": data.name,
          },
        }
      );
      if (!updateMongo)
        throw new Error("Αποτυχία ενημέρωσης στη βάση δεδομένων");
      return res
        .status(200)
        .json({ success: true, message: "Επιτυχής ενημέρωση" });
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
      let updated = await Markes.findOneAndUpdate(
        { _id: id },
        {
          $set: update,
        }
      );
      if (!update) throw new Error("H φωτογραφία δεν ανανεώθηκε στη βάση");
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

  if (action === "saveCatalog") {
    const { catalogName, id } = req.body;
	await connectMongo();

    const now = new Date();
    const formattedDateTime = format(now, "yyyy-MM-dd HH:mm:ss");
    try {
      await connectMongo();
      let result = await Markes.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            catalogName: catalogName,
            catalogDate: formattedDateTime,
          },
        }
      );
      let catalogUpdate = await Catalogs.create({});
      return res.status(200).json({ success: true, result: result });
    } catch (e) {
      return res.status(400).json({ success: false });
    }
  }

  if (action === "findBrandName") {
    await connectMongo();
    const { limit, skip, searchBrand } = req.body;
    try {
      let searchParams;
      if (searchBrand !== "") {
        let regexSearchTerm = new RegExp("^" + searchBrand, "i");
        searchParams = { "softOne.NAME": regexSearchTerm };
      }

      let result = await Markes.find(searchParams, { "softOne.NAME": 1 })
        .skip(skip)
        .limit(limit);
      let totalRecords = await Markes.countDocuments();

      return res
        .status(200)
        .json({ success: true, result: result, totalRecords: totalRecords });
    } catch (e) {
      return res.status(400).json({ success: false, result: null });
    }
  }

  if (action === "relateBrandsToSupplier") {
    const { supplierID, brands } = req.body;
    await connectMongo();
    let brandIds = brands.map((brand) => brand._id);
    try {
      let updateSuppler = await Supplier.updateOne(
        {
          _id: supplierID,
        },
        { $addToSet: { brands: brandIds } }
      );

      for (let brand of brands) {
        let updateBrand = await Markes.findOneAndUpdate(
          { _id: brand._id },
          { $set: { supplier: supplierID } }
        );
      }

      return res.status(200).json({ success: true, result: "ok" });
    } catch (e) {
      return res.status(400).json({
        success: false,
        result: null,
        error: "Πρόβλημα με την προσθήκη",
      });
    }
  }

  if (action === "findCatalogs") {
    await connectMongo();
    const { limit, skip } = req.body;
    try {
      let result = await Markes.find(
        {
          catalogName: { $ne: null },
        },
        { catalogName: 1, catalogDate: 1, softOne: 1 }
      )
        .skip(skip)
        .limit(limit);

      let totalRecords = await Markes.countDocuments();
      return res
        .status(200)
        .json({ success: true, result: result, totalRecords: totalRecords });
    } catch (e) {
      return res.status(400).json({ success: false, result: null });
    }
  }

  if (action === "deleteCatalog") {
    await connectMongo();
    const { id } = req.body;
    try {
      let result = await Markes.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            catalogName: null,
            catalogDate: null,
          },
        }
      );

      return res.status(200).json({ success: true, result: result });
    } catch (e) {
      return res.status(400).json({ success: false, result: null });
    }
  }
  if (action === "addImages") {
    await connectMongo();
    const { imagesURL, id } = req.body;

    try {
      const updatedProduct = await Markes.findOneAndUpdate(
        { _id: id }, // Using the passed 'id' variable
        {
          $addToSet: { images: { $each: imagesURL } }, // Push only the new URLs
        },
        { new: true } // To return the updated document
      );
      return res.status(200).json({
        success: true,
        message: "Επιτυχής εισαγωγή",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
//IMAGES:

  if (action === 'getImages') {
	const { id } = req.body;

	await connectMongo()
	try {
		let result = await Markes.findOne({ _id: id }, { images: 1 });
		return res.status(200).json({ message: "success", result: result?.images })
	} catch (e) {
		return res.status(400).json({ success: false, result: null });
	}

}
if (action === "deleteImage") {
	const {parentId, imageId, name } = req.body;
	try {
		await connectMongo();
		const updatedProduct = await Markes.findOneAndUpdate(
			{ _id: parentId }, // Using the passed 'id' variable
			{
				$pull: {
					images: { 
						_id:  imageId,
						name: name }
				}
			},// Push only the new URLs
			{ new: true } // To return the updated document
		);
		return res.status(200).json({ 
			success: true,
			message: "Επιτυχής διαγραφή",
		});
	} catch (e) {
		return res.status(400).json({ 
			success: false,
			error: e.message,
		});
	}
}
}

