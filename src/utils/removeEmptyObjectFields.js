export function removeEmptyObjectFields(object) {
    const newObject = {};
    for (let key in object) {
        if (object.hasOwnProperty(key) && object[key] !== null && object[key] !== undefined && object[key] !== "") {
            newObject[key] = object[key];
        }
    }
    return newObject;
}