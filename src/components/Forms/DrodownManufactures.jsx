import {useState, useEffect} from "react";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";


export default function DropdownManufacturers ({ 
    state, 
    handleState, 
    isEdit =false, 
    error, 
    required = false 
}) {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(null);

  
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
      isEdit
        ? setValue(options.find((option) => option.VAT == state))
        : setValue(state);
    }, [options]);

    const onChange = (e) => {
        setValue(e.target.value);
      handleState(e);
    }
  
    return (
      <div>
        <label className={`mb-1 block ${error ? "text-red-500" : null}`}>
            Κατασκευαστής 
            {required && <span className="ml-1 font-bold text-red-500">*</span>}
            </label>
        <Dropdown
          filter
          value={value}
          onChange={onChange}
          options={options}
          optionLabel="NAME"
          placeholder="Κατασκευαστής"
          className="w-full"
        />
        {error && <p className="text-red-500 mt-1">{error}</p>}
      </div>
    );
  };

 