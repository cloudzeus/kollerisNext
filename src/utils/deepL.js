const axios = require('axios');

const deeplAuthKey = '[01218e44-5bfd-365e-0a13-8a16c54724c0:fx]';
const targetLang = 'DE';


export default async function deepLtranslator(text, targetLang) {
    const requestData = {
        text: text,
        target_lang: targetLang
      };
      
      axios.post('https://api-free.deepl.com/v2/translate', requestData, {
        headers: {
          'Authorization': `DeepL-Auth-Key ${deeplAuthKey}`,
          'User-Agent': 'dashboard',
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
        })
        .catch(error => {
          console.error('Error:', error);
        });
}


