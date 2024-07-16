"use client";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import axios from "axios";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { useRouter } from "next/router";
import { OverlayPanel } from "primereact/overlaypanel";
import { SearchAndSort } from "@/components/Forms/SearchAndSort";
import { useToast } from "@/_context/ToastContext";
import { Actions } from "@/components/Actions/Actions";
import { DialogImpa } from "@/components/Pages/Dialogs/DialogImpa";


const Impas = () => {
  const [data, setData] = useState([]);
  const [dialog, setDialog] = useState({
    state: false,
    isEdit: false,
  });
  const [rowData, setRowData] = useState(null)
  const op = useRef(null);
  const { showMessage } = useToast();
  const [searchTerm, setSearchTerm] = useState({
    code: "",
    english: "",
    greek: "",
    sortCode: -1,
  });
  const [submitted, setSubmitted] = useState(false);
  const [expandedRows, setExpandedRows] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
  });

  const allowExpansion = (rowData) => {
    return rowData;
  };

  const handleFetch = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/product/apiImpa", {
        action: "findAll",
        skip: lazyState.first,
        limit: lazyState.rows,
        searchTerm: searchTerm,
        sortWithProducts: searchTerm.sortCode,
      });
      setData(data.result);
      setTotalRecords(data.totalRecords);
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message: e?.response?.data?.error || e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [searchTerm, lazyState.rows, lazyState.first, submitted]);


  const openNew = () => {
    setDialog((prev) => ({ ...prev, state: true, isEdit: false }));
  };

  const hideDialog = () => {
    setDialog((prev) => ({ ...prev, state: false, isEdit: false }));
  };

 


  const onEdit = (rowData) => {
    setDialog((prev) => ({ ...prev, state: true, isEdit: true }));
    setRowData(rowData);
  };


  const onDelete = async ({ _id }) => {
    try {
      await axios.post("/api/product/apiImpa", {
        action: "deleteOne",
        id: _id,
      });
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: "Επιτυχής Διαγραφή",
      });
    } catch (e) {
    } finally {
        setSubmitted(prev => !prev);

    }
  };

  const onSelectionChange = (e) => {
    setSelected(e.value);
  };

  return (
    <AdminLayout>
      <p className="stepheader">Κωδικοί Impas</p>
      <Toolbar
        start={() => (
          <LeftToolbarTemplate
            setSubmitted={setSubmitted}
            setSelected={setSelected}
            selected={selected}
            op={op}
            openNew={openNew}
          />
        )}
      ></Toolbar>
      <DataTable
        selectionMode={"checkbox"}
        selection={selected}
        onSelectionChange={onSelectionChange}
        showGridlines
        key={"code"}
        value={data}
        first={lazyState.first}
        rows={lazyState.rows}
        onPage={(event) => setlazyState(event)}
        lazy
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={(props) => (
          <ExpandedDataTable
            id={props._id}
            setSubmitted={setSubmitted}
          />
        )}
        paginator
        totalRecords={totalRecords}
        loading={loading}
        rowsPerPageOptions={[20, 50, 100, 200, 500]}
        filterDisplay="row"
        tableStyle={{ minWidth: "50rem" }}
      > 
       <Column 
            style={{ width: "40px" }}
            body={(rowData) => (
                <Actions
                  label="Τροποποίηση Impa"
                  onEdit={() => onEdit(rowData)}>
                    <Button 
                        label="Διαγραφή Impa"
                        icon="pi pi-trash"
                        className="w-full"
                        severity="danger"
                        onClick={() => onDelete(rowData)}
                    />
                  </Actions>
        )}></Column>
        <Column
          selectionMode="multiple"
          filed="selection"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column
          bodyStyle={{ textAlign: "center" }}
          expander={allowExpansion}
          style={{ width: "20px" }}
        />
        <Column
          field="code"
          header="Κωδικός Impa"
          filter
          filterElement={() => (
            <SearchAndSort
              state={searchTerm.code}
              handleState={(value) =>
                setSearchTerm((prev) => ({ ...prev, code: value }))
              }
              sort={searchTerm.sortCode}
              handleSort={(val) =>
                setSearchTerm((prev) => ({ ...prev, sortCode: val }))
              }
            />
          )}
          showFilterMenu={false}
          body={ImpaCode}
        ></Column>
        <Column
          field="englishDescription"
          header="Αγγλική Περιγραφή"
          filter
          filterElement={() => (
            <div className="flex justify-content-start ">
              <span className="p-input-icon-left w-5">
                <i className="pi pi-search" />
                <InputText
                  className="custom_input"
                  value={searchTerm.english}
                  onChange={(e) =>
                    setSearchTerm((prev) => ({
                      ...prev,
                      english: e.target.value,
                    }))
                  }
                />
              </span>
            </div>
          )}
          showFilterMenu={false}
        ></Column>
        <Column
          field="greekDescription"
          header="Ελληνική Περιγραφή"
          filter
          filterElement={() => (
            <div className="flex justify-content-start ">
              <span className="p-input-icon-left w-5">
                <i className="pi pi-search" />
                <InputText
                  className="custom_input"
                  value={searchTerm.greek}
                  onChange={(e) =>
                    setSearchTerm((prev) => ({
                      ...prev,
                      greek: e.target.value,
                    }))
                  }
                />
              </span>
            </div>
          )}
          showFilterMenu={false}
        ></Column>
        <Column field="unit" header="Unit"></Column>
        <Column
          field="isActive"
          header="Κατάσταση Impa"
          body={IsActive}
        ></Column>
       
      </DataTable>
       <DialogImpa
        data={rowData}
        isEdit={dialog.isEdit}
        dialog={dialog.state}
        hideDialog={hideDialog}
        setSubmitted={setSubmitted}
      />
    </AdminLayout>
  );
};

const LeftToolbarTemplate = ({ op, openNew, selected, setSelected, setSubmitted }) => {
    const {showMessage} = useToast();

    const onStatusChange = async (action) => {
        try {
          let { data } = await axios.post("/api/product/apiImpa", {
            action: action,
            selected: selected,
          });
          showMessage({
            severity: "success",
            summary: "Επιτυχία",
            message: data.message || "Επιτυχής Ενέργεια", 
        })
          
        } catch (e) {
            showMessage({
                severity: "error",
                summary: "Σφάλμα",
                message: e?.response?.data?.error || e.message,
            })
        } finally {
            setSelected([]);
            setSubmitted((prev) => !prev);
        }
      };
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        label="Νέο"
        icon="pi pi-plus"
        severity="secondary"
        onClick={openNew}
      />
      <div className="card flex justify-content-center">
        <Button
          icon="pi pi-angle-down"
          type="button"
          tooltip="Επιλέξτε Impa για να τα Ενεργοποιήσετε/Απενεργοποιήσετε"
          tooltipOptions={{ position: "top" }}
          label="Aλλαγή Impa Status"
          onClick={(e) => op.current.toggle(e)}
        />
        <OverlayPanel ref={op}>
          <div className="flex flex-column">
            <Button
              disabled={!selected || !selected.length}
              className="mb-2"
              icon="pi pi-times"
              label="Απενεργοποίηση Impa"
              severity="danger"
              onClick={() => onStatusChange("deactivate")}
            />
            <Button
              disabled={!selected || !selected.length}
              label="Eνεργοποίηση Impa"
              icon="pi pi-check"
              severity="success"
              onClick={() => onStatusChange("activate")}
            />
          </div>
        </OverlayPanel>
      </div>
    </div>
  );
};

const ImpaCode = ({ code, products }) => {
  return (
    <div>
      <span className="block font-bold">{code}</span>
      {products.length > 0 ? (
        <div className="flex align-items-center  mt-1 text-sm">
          <span className="">products:</span>
          <span className="block ml-1 font-bold text-primary">
            {products.length}
          </span>
        </div>
      ) : null}
    </div>
  );
};

const ExpandedDataTable = ({ id,  setSubmitted }) => {
  const router = useRouter();
  const {showMessage} = useToast()
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const handleFetch = async () => {
    setLoading(true);
    try {
      let { data } = await axios.post("/api/product/apiImpa", {
        action: "findImpaProducts",
        id: id,
      });
      setData(data.result);
      setLoading(false);
    } catch (e) {
        showMessage({
            severity: "error",
            summary: "Σφάλμα",
            message: e?.response?.data?.error || e.message,
        })
    } finally {
        setLoading(false);
    }
  };
  useEffect(() => {
    handleFetch();
  }, []);

  const handleClick = () => {
    router.push(`/dashboard/products-to-impa/${id}`);
  };

  const handleDeleteItems = async () => {
    try {
        setLoading(true);
        let { data } = await axios.post("/api/product/apiImpa", {
            action: "deleteImpaProduct",
            impaId: id,
            selected: selected,
          });
    } catch(e) {
        showMessage({
            severity: "error",
            summary: "Σφάλμα",
            message: e?.response?.data?.error || e.message,
        })
    } finally {
        setSubmitted((prev) => !prev);
        setLoading(false);
    }
    

   
  };


  return (
    <div className="p-4">
      <p className="font-semibold mb-3 ">Προϊόντα συσχετισμένα με impa:</p>
      <DataTable
        selectionMode={"checkbox"}
        selection={selected}
        onSelectionChange={(e) => setSelected(e.value)}
        loading={loading}
        showGridlines
        header={() => (
            <div>
            <Button
              label="Νέο"
              tooltip="Προσθήκη νέου προϊόντος"
              tooltipOptions={{ position: "top" }}
              icon="pi pi-plus"
              severity="secondary"
              onClick={handleClick}
            />
            <Button
              disabled={!selected || !selected.length}
              className="ml-2"
              tooltip="Επιλέξτε προϊόντα για να τα διαγράψετε"
              tooltipOptions={{ position: "top" }}
              icon="pi pi-trash"
              severity="danger"
              onClick={handleDeleteItems}
            />
          </div>
        )}
        dataKey="_id"
        value={data}
      >
        
        <Column
          selectionMode="multiple"
          filed="selection"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column field="NAME" header="Προϊόν"></Column>
        <Column field="CODE" style={{ width: "50px" }}></Column>
      </DataTable>
    </div>
  );
};

const IsActive = ({ isActive }) => {
  return (
    <div
      style={{ width: "20px", height: "20px" }}
      className={`${
        isActive ? "bg-green-500" : "bg-red-500"
      } border-round flex align-items-center justify-content-center`}
    >
      {isActive ? (
        <i className="pi pi-check text-white text-xs"></i>
      ) : (
        <i className="pi pi-times text-white text-xs"></i>
      )}
    </div>
  );
};


export default Impas;
