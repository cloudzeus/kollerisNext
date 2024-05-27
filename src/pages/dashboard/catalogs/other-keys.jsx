import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { useRouter } from "next/router";
import { clearMongoKeys, setAttribute } from "@/features/catalogSlice";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "primereact/dropdown";
import { setSelectedMongoKey } from "@/features/catalogSlice";
import { Toast } from "primereact/toast";
import StepHeader from "@/components/StepHeader";
import { set } from "mongoose";

const OurDatabaseKeys = [
  { key: 0, header: "Κανένα" },
  { key: "CODE2", header: "Κωδικός Εργοστασίου" },
  { key: "CODE1", header: "Κωδικός EAN" },
  { key: "CODE", header: "Κωδικός ERP" },
  { key: "NAME", header: "Όνομα" },
  { key: "NAME_ENG", header: "Όνομα Αγγλικά" },
  { key: "PRICER", header: "ΤΙΜΗ ΧΟΝΔΡΙΚΗΣ" },
  { key: "PRICEW", header: "ΤΙΜΗ ΛΙΑΝΙΚΗΣ" },
  { key: "PRICER02", header: "ΤΙΜΗ SKROUTZ" },
  { key: "DESCRIPTION", header: "Περιγραφή" },
  { key: "DESCRIPTION_ENG", header: "Περιγραφή Αγγλικά" },
  { key: "VOLUME", header: "Όγκος" },
  { key: "GWEIGHT", header: "Μικτό Βάρος" },
  { key: "WIDTH", header: "Πλάτος" },
  { key: "HEIGHT", header: "Ύψος" },
  { key: "LENGTH", header: "Μήκος" },
  { key: "VAT", header: "ΦΠΑ" },
  { key: "isSkroutz", header: "Συμμετέχει στο Skroutz" },
];

const Page = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useRef(null);
  const { gridData, headers, mongoKeys, attributes } = useSelector(
    (state) => state.catalog
  );
  const [newPairs, setNewPairs] = useState([]);
  useEffect(() => {
    clearMongoKeys();
  }, []);

  const showError = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 6000,
    });
  };

 

  const SelectTemplate = ({ field }) => {
    const dispatch = useDispatch();
    const [selectedOption, setSelectedOption] = useState(null);




     const handleChange = (e) => {
      const { key, header } = e.value;
      setSelectedOption(e.value);
    //   const updatedPairs = newPairs.filter((item) => item.key !== field);
    //   updatedPairs.push({ key: field, related: key, header: header });
    //   setNewPairs(updatedPairs);
      dispatch(setSelectedMongoKey({ 
        oldKey: field, 
        related: key, 
        header: header }));
    };

    useEffect(() => {
        console.log({attributes})
    }, [attributes])
    const handleCustomAttribute = () => {
        dispatch(setAttribute({
            name: "test",
            oldKey: field,
        }))
    }
    return (
      <div className="flex">
        <Dropdown
          filter
          showClear
          value={selectedOption}
          onChange={handleChange}
          options={OurDatabaseKeys}
          optionLabel="header"
          placeholder="Συσχέτιση"
          className="w-full"
        />
        <Button onClick={handleCustomAttribute} icon="pi pi-plus" className="p-button-rounded p-button-text" />
      </div>
    );
  };

  const handleMongoKeysChange = () => {
    const codeCondition = mongoKeys.some((key) => key.related === "CODE2");
    if (!codeCondition) {
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    let condition = handleMongoKeysChange();
    if (!condition) {
      showError("Πρέπει να επιλέξεις στήλη τον ΚΩΔΙΚΟ ΕΡΓΟΣΤΑΣΙΟΥ");
      return;
    }

    setSelectedMongoKey([]);
    router.push("/dashboard/catalogs/result");
  };

  return (
    <AdminLayout>
      <Toast ref={toast} />
      <StepHeader text="Συσχετισμός Κλειδίων" />
      <div className="mb-4 mt-2">
        <p>
          Υποχρεωτικό Πεδίο:{" "}
          <span className="font-bold"> Κωδικός Εργοστασίου</span>
        </p>
        <p>
          Συσχετείστε τα πεδία που επιθυμείτε από τον κατάλογο σας με τα
          παρακάτω κλειδιά της βάσης μας
        </p>
      </div>
      <DataTable
        showGridlines
        loading={loading}
        selectionMode="radiobutton"
        paginator
        rows={10}
        rowsPerPageOptions={[20, 50, 100, 200]}
        value={gridData.slice(0, 5)}
        tableStyle={{ minWidth: "50rem" }}
        filterDisplay="row"
      >
        {headers.map((header, index) => (
          <Column
            filterElement={SelectTemplate}
            showFilterMenu={false}
            filter
            key={header.field}
            field={header.field}
            header={header.field}
          />
        ))}
      </DataTable>
      <Button label="Διαμόρφωση" onClick={onSubmit} className="mt-2" />
    </AdminLayout>
  );
};

export default Page;
