import axios from "axios";
let AccessKey = process.env.NEXT_PUBLIC_BUNNY_KEY;

const storageZoneName = 'kolleris'
const region = 'storage'
const headers = {
  AccessKey: AccessKey,
  'Content-Type': 'application/octet-stream',
}

const readAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
          resolve(event.target.result);
      };
      reader.onerror = (error) => {
          reject(error);
      };
      reader.readAsArrayBuffer(file);
  });
};


export async function uploadBufferBunny(data, fileName) {
   let buffer;
  try {
    buffer = await readAsArrayBuffer(data);
  } catch (e) {
    return { 
      success: false,
      error: 'Υπήρξε πρόβλημα κατά την αποθήκευση της φωτογραφίας στο CDN'
     };
  }

  try {
    // Simulating an error for testing purposes
    let result = await axios.put(`https://${region}.bunnycdn.com/${storageZoneName}/images/${fileName}`, buffer, { headers: headers });
    if (result.data.HttpCode !== 201) {
      return { 
        success: false,
        error: 'Υπήρξε πρόβλημα κατά την αποθήκευση της φωτογραφίας στο CDN'
       };
    }
    return {
      success: true,
      message: 'H Φωτογραφία ανέβηκε στο CDN'
    };
  } catch (e) {
    return { 
      success: false,
      error: 'Υπήρξε πρόβλημα κατά την αποθήκευση της φωτογραφίας στο CDN'
     };
  }
  
}




export async function uploadBunny(data, fileName) {
    let result = await axios.put(`https://${region}.bunnycdn.com/${storageZoneName}/images/${fileName}`, data , { headers: headers })
    return result.data
}
export async function uploadBunnyFolderName(data, fileName, folderName) {
    let result = await axios.put(`https://${region}.bunnycdn.com/${storageZoneName}/${folderName}/${fileName}`, data , { headers: headers })
    return result.data
}

export async function deleteBunny(fileName) {
  try {
     await axios.delete(`https://${region}.bunnycdn.com/${storageZoneName}/images/${fileName}`, { headers: {
      AccessKey: AccessKey
    } })
    return {
      success: true,
      message: 'Η φωτογραφία διαγράφτηκε από το CDN'
    }
  } catch(e) {
   
    return { 
      success: false,
      error: e.response.data?.Message || e.message,
      status: e.response?.data?.HttpCode 
    }
  
  }
 
 
}




