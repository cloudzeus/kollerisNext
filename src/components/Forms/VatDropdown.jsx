import {useState, useEffect} from "react";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { classNames } from 'primereact/utils';

const VatDropdown = ({ state, handleState, isEdit =false, error, required = false }) => {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(null);

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
      isEdit
        ? setValue(options.find((option) => option.VAT == state))
        : setValue(state);
    }, [options]);

    const onChange = (e) => {
        setValue(e.target.value);
      handleState(e);
    }
  
    return (
      <div className="card mb-3">
        <label className={`mb-2 block ${error ? "text-red-500" : null}`}>Αλλαγή ΦΠΑ {required && "*"}</label>
        <Dropdown
          value={value}
          onChange={onChange}
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