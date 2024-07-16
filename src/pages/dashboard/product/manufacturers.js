import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import RegisterUserActions from "@/components/grid/GridRegisterUserActions";
import { useSession } from "next-auth/react";
import { Actions } from "@/components/Actions/Actions";
import { DialogManufacturers } from "@/components/Pages/Dialogs/DialogManufacturer";
import { useToast } from "@/_context/ToastContext";
export default function Manufacturers() {

  const [submitted, setSubmitted] = useState(false);
  const {showMessage} = useToast();
  const [dialog, setDialog] = useState({
    state: false,
    isEdit: false,
  });
  const [data, setData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  let user = session?.user;

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const handleFetch = async () => {
    try {
      setLoading(true);
      let res = await axios.post("/api/product/apiManufacturers", {
        action: "findAll",
      });
      setData(res.data.result);
    } catch(e) {
      showMessage({
          severity: 'error',
          summary: 'Error',
          message: e?.response?.data?.error || e.message
      })
    } finally {
      setLoading(false);
    }
   
   
  };

  useEffect(() => {
    handleFetch();
  }, [submitted]);

  const renderHeader = () => {
    const value = filters["global"] ? filters["global"].value : "";
    return (
      <>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            value={value || ""}
            onChange={(e) => onGlobalFilterChange(e)}
            placeholder="Αναζήτηση"
          />
        </span>
      </>
    );
  };
  const header = renderHeader();
  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
  };

  const onEdit = async (data) => {
    setRowData(data);
    setDialog((prev) => ({ ...prev, state: true, isEdit: true }));
  };
  //Add
  const openNew = () => {
    setSubmitted(false);
    setDialog((prev) => ({ ...prev, state: true, isEdit: false }));
  };

  const hideDialog = () => {
    setDialog((prev) => ({ ...prev, state: false, isEdit: false }));
  };
  

  return (
    <AdminLayout>
      <p className="stepheader">Κατασκευαστές</p>
      <Toolbar start={() => (
         <div className="flex flex-wrap gap-2">
         <Button
           label="Νέο"
           icon="pi pi-plus"
           severity="secondary"
           onClick={openNew}
         />
       </div>
      )}></Toolbar>
      <DataTable
        header={header}
        value={data}
        paginator
        rows={8}
        rowsPerPageOptions={[20, 50, 100, 200, 500]}
        showGridlines
        dataKey="_id"
        filters={filters}
        paginatorRight={true}
        removableSort
        onFilter={(e) => setFilters(e.filters)}
        loading={loading}
        editMode="row"
        selectOnEdit
      >
        {user?.role === "admin" ? (
          <Column
            style={{ width: "40px" }}
            body={(rowData) => (
              <Actions 
                label="Τροποποίηση Κατασκευαστή" 
                onEdit={() => onEdit(rowData)}></Actions>
            )}
          ></Column>
        ) : null}
        <Column field="NAME" header="Kατασκευαστής" sortable></Column>
        <Column
          field="updatedFrom"
          sortable
          header="τροποποιήθηκε Από"
          body={UpdatedFromTemplate}
          style={{ width: "90px" }}
        ></Column>
      </DataTable>
      <DialogManufacturers
        data={rowData}
        isEdit={dialog.isEdit}
        dialog={dialog.state}
        setSubmitted={setSubmitted}
        hideDialog={hideDialog}
      />
    </AdminLayout>
  );
}


const UpdatedFromTemplate = ({ updatedFrom, updatedAt }) => {
  return (
    <RegisterUserActions
      actionFrom={updatedFrom}
      at={updatedAt}
      icon="pi pi-user"
      color="#fff"
      backgroundColor="var(--yellow-500)"
    />
  );
};

