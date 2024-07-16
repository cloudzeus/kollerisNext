import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { useToast } from "@/_context/ToastContext";

export default function DropdownGroupsNoParent({
  value,
  onChange,
  error,
  required = false,
  optionLabel,
}) {
  const [options, setOptions] = useState([]);
    const {showMessage} = useToast()

  const handleFetch = async () => {
        try {
            let { data } = await axios.post("/api/product/apiProductFilters", {
                action: "findGroupsNoParent",
              });
              setOptions(data.result);
        } catch (e) {
            showMessage({
                severity: "error",
                summary: "Σφάλμα",
                message: e.response?.data?.error || e.message,
              
            })
        }
  };

  useEffect(() => {
    (async () => {
      await handleFetch();
    })();
  }, []);

 
  return (
    <div className="dropdown_container">
        <label className={`custom_label ${error ? "text-red-600" : null}`}>
          Ομάδα
          {required && <span className="ml-1 font-bold text-red-500">*</span>}
        </label>
      <div className="custom_dropdown_wrapper">
        <Dropdown
          showClear
          filter
          value={value}
          onChange={onChange}
          options={options}
          optionLabel={optionLabel}
          placeholder="Ομάδα"
          className={`custom_dropdown ${error ? "p-invalid" : null}`}
         
        />
      </div>
      {error ? <p className="text-red-600 mt-1">{error}</p> : null}
    </div>
  );
}
