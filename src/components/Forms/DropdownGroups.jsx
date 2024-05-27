import {useState, useEffect} from "react";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";


export default function DropdownGroups ({ 
    state, 
    handleState, 
    isEdit =false, 
    error, 
    required = false,
    categoryId
}) {
    const [options, setOptions] = useState([]);
    const handleFetch = async () => {

        let { data } = await axios.post("/api/product/apiProductFilters", {
            action: "findGroups",
            categoryID: categoryId,
          });
        setOptions(data.result);
      };


      useEffect(() => {
       
        (async () => {
          await  handleFetch();
        })()


      }, [categoryId]);



    useEffect(() => {

      if(!isEdit && !options) return
        let option = options.find((option) => option.softOne.MTRGROUP == state);
        if(!option) return;
        handleState(option);
    }, [options]);


  
    return (
      <div >
        <label className={`mb-1 block ${error ? "text-red-500" : null}`}>
            Ομάδα
            {required && <span className="ml-1 font-bold text-red-500">*</span>}
            </label>
        <Dropdown
           filter
          value={state}
          onChange={(e) => handleState(e.target.value)}
          options={options}
          optionLabel="groupName"
          placeholder="Ομάδα"
          className="w-full"
        />
        <p className="text-red-500 mt-1">{error}</p>
      </div>
    );
  };

 