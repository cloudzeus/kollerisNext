import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
export default function FilterManufacturer({ value,  onChange,  }) {

    const [categories, setCategories] = useState([]);
    const handleCategories = async () => {
        let { data } = await axios.post("/api/product/apiProductFilters", {
            action: "findManufacturers",
        });
        console.log({data})
        setCategories(data.result);
        };
    
    useEffect(() => {
        
        handleCategories();
    }, []);

  const onDelete = () => {
    onChange(null)
  };
  return (
    <div className="flex align-items-center">
      <Dropdown
        emptyMessage="Δεν υπάρχουν κατηγορίες"
        value={value}
        options={categories}
        onChange={(e) => onChange(e.target.value)}
        optionLabel="NAME"
        placeholder="Φίλτρο Κατηγορίας"
        //product.css
        className="column_dropdown_med"
      />
      <i className="pi pi-times ml-2 cursor-pointer" onClick={onDelete}></i>
    </div>
  );
}
