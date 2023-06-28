import { DataArrayOutlined } from "@mui/icons-material";

export const validateEmptyInput = (data) => {
    for(let item of data) {
        if(item === '') {
            return false
        }
    }
    return true;
}


export const validateString = (input) => {
    const stringRegex = /^[A-Za-z]+$/;
    return stringRegex.test(input);
}