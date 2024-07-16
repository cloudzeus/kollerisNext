import axios from "axios";
//CREATE GROUP:
export async function createSoftoneGroup(groupName, MTRCATEGORY) {

    if(!groupName || !MTRCATEGORY) {
        return {
            error: "Αποτυχία Softone, δεν έχετε δώσει Όνομα Ομάδας και Κατηγορία Είδους",
            message: "No groupName or MTRCATEGORY",
            success: false
        }
    }
    try {
      let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrGroup/createMtrGroup`;
      const { data } = await axios.post(URL, {
        username: "Service",
        password: "Service",
        name: groupName,
        isactive: 1,
        mtrcategory: MTRCATEGORY,
      });
      return data;
    } catch (e) {
      return {
        error: e.message,
        success: false,
      };
    }
  }




  