import {useState, useEffect} from "react";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";

const VatDropdown = ({ state, handleState, isEdit =false, error, required = false }) => {
    const [options, setOptions] = useState([]);

    const handleFetch = async () => {
      let { data } = await axios.post("/api/product/apiProductFilters", {
        action: "findVats",
      });
      setOptions(data.result);
    };
    useEffect(() => {
      handleFetch();
    }, []); 

    useEffect(() => {
        if(!isEdit && !options) return
        let option = options.find((option) => option.VAT == state);
        if(!option) return;
        handleState(option);
    }, [options]);

    
    return (
      <div className="">
        <label className={`mb-1 block ${error ? "text-red-500" : null}`}>Αλλαγή ΦΠΑ {required && "*"}</label>
        <Dropdown
          value={state}
          onChange={(e) => handleState(e.target.value)}
          options={options}
          optionLabel="NAME"
          placeholder="ΦΠΑ"
          className="w-full"
        />
        <p className="text-red-500 mt-1">{error}</p>
      </div>
    );
  };

  export default VatDropdown;