 function compareArrays(arr1, arr2, keys, id ) {
    const newArray = [];
    for (let i = 0; i < arr1.length; i++) {
        //SERVER ARRAY:
        const object1 = arr1[i].softOne;
        //SOSFTONE:
        for (let j = 0; j < arr2.length; j++) {
            const object2 = arr2[j];
            if (compareObjects(object1, object2, keys, id)) {
                newArray.push({
                    ourObject: object1,
                    softoneObject: object2
                })
            }
        }

    }
    return newArray;
}



function compareObjects(object1, object2, keys, id) {
    const id1 = object1[id].toString(); // Retrieve ID from :OUR OBJECT
    const id2 = object2[id].toString(); // Retrieve ID from: SOFTONE OBJECT
    // console.log(object2)
    if (id1 == id2) { // Check if IDs are the same
        // const keys = Object.keys(object1);
        for (const key of keys) {
            console.log(key)
            if (object1[key].toString() !== object2[key].toString()) {
                
                return true; // Values are not the same
            }
        }
        return false; // All values are the same
    }

    return false; // IDs are different
}


export default compareArrays;