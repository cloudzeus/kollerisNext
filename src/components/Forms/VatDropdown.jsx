import {useState, useEffect} from "react";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";

const VatDropdown = ({ state, handleState, isEdit =false, error }) => {
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
        <span className="mb-2 block">Aλλαγή ΦΠΑ</span>
        <Dropdown
          value={value}
          onChange={onChange}
          options={options}
          optionLabel="NAME"
          placeholder="ΦΠΑ"
          className="w-full"
        />
        <small className="text-red-500">{error}</small>
      </div>
    );
  };

  export default VatDropdown;