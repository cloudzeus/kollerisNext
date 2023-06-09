

import formidable from "formidable";
export default async function handler(req, res) {
    const form = formidable.IncomingForm();
    console.log(form);

}