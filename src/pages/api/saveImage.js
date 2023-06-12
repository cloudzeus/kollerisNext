
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
		options.uploadDir = path.join(process.cwd(), "/public/uploads");
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

export default async function handler(req, res) {
	console.log(req.fields, req.files)
	try {
		 await fs.readdir(path.join(process.cwd() + "/public", "/uploads"));
	  } catch (error) {
		await fs.mkdir(path.join(process.cwd() + "/public", "/uploads"));
	  }
	  let response = await readFile(req, true);
	  if(response) {
		let filename = response?.files?.myFile?.newFilename
		return res.json({ done: "ok", newFilename: filename });
	  } else {
		return res.json({ done: "not ok", newFilename: null });
	  }
	
}


