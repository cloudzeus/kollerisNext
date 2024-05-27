import {useState, useEffect} from "react";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";


export default function DropdownSubroups ({ 
    state, 
    handleState, 
    isEdit =false, 
    error, 
    required = false,
    groupId,
}) {
    const [options, setOptions] = useState([]);
   
    const handleFetch = async () => {
        let { data } = await axios.post("/api/product/apiProductFilters", {
            action: "findSubGroups",
            groupID: groupId,
          });
        setOptions(data.result);
      };
      useEffect(() => {
        (async () => {
          await  handleFetch();
        })()
      }, [groupId]);

   
      useEffect(() => {
        if(!options) return
        if(isEdit) {
          handleEdit(options);
        }
      }, [options, groupId]);
  
      const handleEdit = (options) => {
        let option = options.find((option) => option.softOne.cccSubgroup2 == state);
        if (option) {
          handleState(option);
        }
      }
  
    return (
      <div >
        <label className={`mb-1 block ${error ? "text-red-500" : null}`}>
            Υποομάδα
            {required && <span className="ml-1 font-bold text-red-500">*</span>}
            </label>
        <Dropdown
           filter
          value={state}
          onChange={(e) => handleState(e.target.value)}
          options={options}
          optionLabel="subGroupName"
          placeholder="Yποομάδα"
          className="w-full"
        />
        <p className="text-red-500 mt-1">{error}</p>
      </div>
    );
  };

 