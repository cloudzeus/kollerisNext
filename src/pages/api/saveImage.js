
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = {
	api: {
		bodyParser: false,
	},
};

const readFile = (req, saveLocally) => {

	const options = {};
	if (saveLocally) {
		options.uploadDir = path.join(process.cwd(), "/public/static/uploads");
		options.filename = (name, ext, path, form) => {
		  return Date.now().toString() + "_" + path.originalFilename;
		};
	  }
	options.maxFileSize = 4000 * 1024 * 1024;
	const form = formidable(options);

	return new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
		  if (err) reject(err);
		  resolve({ fields, files });
		});
	});
}

export default async (req, res) => {
	try {
		 await fs.readdir(path.join(process.cwd() + "/public/static/", "/uploads"));
	  } catch (error) {
		await fs.mkdir(path.join(process.cwd() + "/public/static", "/uploads"));
	  }
	  let response = await readFile(req, true);
	//   console.log(response.files.myFile.newFilename)
	  let filename = response.files.myFile.newFilename
	  res.json({ done: "ok", newFilename: filename });
}


