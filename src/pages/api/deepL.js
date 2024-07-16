import axios from "axios";
import * as deepl from 'deepl-node';

const authKey = '01218e44-5bfd-365e-0a13-8a16c54724c0:fx';



export default async function handler(req, res) {

    const { text, targetLang } = req.body;


    let lang = targetLang;
    if( targetLang === 'GB') {
        lang = 'en-GB'
    }
    if( targetLang === 'GE') {
        lang = 'de'
    }


    const requestData = {
        text: [text],
        target_lang: targetLang
      };
      const translator = new deepl.Translator(authKey);
      let response = async () => {
        const result = await translator.translateText(text, null, lang.toLowerCase());
        return result.text
      }

      let translatedText = await response();
        return res.status(200).json({ success: true, translatedText: translatedText });
}
