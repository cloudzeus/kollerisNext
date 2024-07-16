import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import RegisterUserActions from "@/components/grid/GridRegisterUserActions";
import GridLogoTemplate from "@/components/grid/gridLogoTemplate";
import { useSession } from "next-auth/react";
import { DialogSubgroup } from "../Dialogs/DialogSubgroup";
import { Actions } from "@/components/Actions/Actions";
import { useToast } from "@/_context/ToastContext";

export default function MtrSubgroups() {
  const {showMessage} = useToast()
  const [dialog, setDialog] = useState({
    state: false,
    isEdit: false,
  });
  const [rowData, setRowData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  let user = session?.user;

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  //FILTERS:
  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
  };

  //FETCH DATA:
  const handleFetch = async () => {
    setLoading(true);

    try {
      let res = await axios.post("/api/product/apiSubGroup", {
        action: "findAll",
      });
      setData(res.data.result);
    } catch(e) {
        showMessage({
          severity: "error",
          summary: "Σφάλμα",
          message: e?.response?.data?.error || e.message
        })
    } finally {
      setLoading(false);
    }
  
  };

  useEffect(() => {
    handleFetch();
  }, []);

  //REFETCH ON SUBMIT:
  useEffect(() => {
    if (submitted) handleFetch();
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


  const onEdit = async (data) => {
    setRowData(data);
    setDialog((prev) => ({ ...prev, state: true, isEdit: true }));
  };

  //Add product
  const openNew = () => {
    setSubmitted(false);
    setDialog((prev) => ({ ...prev, state: true, isEdit: false }));
  };

  const hideDialog = () => {
    setDialog((prev) => ({ ...prev, state: false, isEdit: false }));
  };

  return (
    <>
      <Toolbar
        start={() => (
          <div className="flex flex-wrap gap-2">
            <Button
              label="Νέο"
              icon="pi pi-plus"
              severity="secondary"
              onClick={openNew}
            />
          </div>
        )}
      ></Toolbar>
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
        className="p-datatable-sm"
        selectOnEdit
      >
        {user?.role === "admin" ? (
          <Column
            style={{ width: "40px" }}
            body={(rowData) => (
              <Actions 
              label="Τροποποίηση Υποομάδας"
              onEdit={() => onEdit(rowData)}>

              </Actions>
            )}
          ></Column>
        ) : null}
        <Column
          field="subGroupIcon"
          header="Εικονίδιο"
          body={(data) => <GridLogoTemplate logo={data.subGroupIcon} />}
          style={{ width: "50px" }}
        ></Column>
        <Column
          field="subGroupImage"
          header="Φωτογραφία"
          body={(data) => <GridLogoTemplate logo={data.subGroupImage} />}
          style={{ width: "50px" }}
        ></Column>
        <Column
          field="group.groupName"
          header="Ομάδα"
          style={{ width: "120px" }}
        ></Column>
        <Column field="subGroupName" header="Όνομα Υποκατηγορίας"></Column>
        <Column
          field="englishName"
          header="Μετάφραση"
          style={{ width: "90px" }}
        ></Column>
        <Column
          field="updatedFrom"
          header="Τροποποίηση Από"
          style={{ width: "90px" }}
          body={UpdatedFromTemplate}
        ></Column>
      </DataTable>
      <DialogSubgroup
        data={rowData}
        isEdit={dialog.isEdit}
        dialog={dialog.state}
        hideDialog={hideDialog}
        setSubmitted={setSubmitted}
      />
    </>
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
