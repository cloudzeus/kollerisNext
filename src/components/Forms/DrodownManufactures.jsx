import {useState, useEffect} from "react";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";


export default function DropdownManufacturers ({ 
    state, 
    handleState, 
    isEdit =false, 
    error, 
    isFilter = false,
    required = false 
}) {
    const [options, setOptions] = useState([]);
  
    const handleFetch = async () => {
        let { data } = await axios.post("/api/product/apiProductFilters", {
          action: "findManufacturers",
        });
        setOptions(data.result);
      };
      useEffect(() => {
        (async () => {
          await  handleFetch();
        })()
      }, []);

    

    
    useEffect(() => {

      if(!isEdit && !options) return
        let option = options.find((option) => option.MTRMANFCTR == state);
        if(!option) return;
        handleState(option);
    }, [options]);
   
  
    return (
      <div  className="w-full">
        {!isFilter ? (
           <label className={`custom_label ${error ? "text-red-600" : null}`}>
           Κατασκευαστής 
           {required && <span className="ml-1 font-bold text-red-500">*</span>}
           </label>
        ) : null}
        <Dropdown
          showClear
          filter
          value={state}
          onChange={(e) => handleState(e.target.value)}
          options={options}
          optionLabel="NAME"
          placeholder="Κατασκευαστής"
          className={`custom_dropdown ${error ? "p-invalid" : null}`}
        />
        {error && <p className="text-red-600 mt-1">{error}</p>}
      </div>
    );
  };

 