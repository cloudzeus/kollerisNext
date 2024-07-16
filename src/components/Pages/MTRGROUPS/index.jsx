import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import RegisterUserActions from "@/components/grid/GridRegisterUserActions";
import { useSession } from "next-auth/react";
import GridLogoTemplate from "@/components/grid/gridLogoTemplate";
import { Actions } from "@/components/Actions/Actions";
import MtrSubgroups from "../MTRSUBGROUPS";
import { DialogGroup } from "../Dialogs/DialogGroup";

export default function MtrGroups() {
  const [dialog, setDialog] = useState({
    state: false,
    isEdit: false,
  });
  const [rowData, setRowData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState([]);
  const toast = useRef(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  let user = session?.user;
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const handleFetch = async () => {
    setLoading(true);
    let res = await axios.post("/api/product/apiGroup", { action: "findAll" });
    setData(res.data.result);
    setLoading(false);
  };

  useEffect(() => {
    handleFetch();
  }, []);

  //Refetch on add edit:
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

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;
    setFilters(_filters);
  };

  const allowExpansion = (rowData) => {
    return rowData;
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Νέο"
          icon="pi pi-plus"
          severity="secondary"
          onClick={openNew}
        />
      </div>
    );
  };

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

 

  const logoTemplate = (data) => {
    return <GridLogoTemplate logo={data.groupIcon} />;
  };

  const imageTemplate = (data) => {
    return <GridLogoTemplate logo={data.groupImage} />;
  };

 

  return (
    <>
      <Toast ref={toast} />
      <Toolbar start={leftToolbarTemplate}></Toolbar>
      <DataTable
        header={header}
        value={data}
        paginator
        rows={8}
        rowsPerPageOptions={[20, 50, 100, 200, 500]}
        showGridlines
        rowExpansionTemplate={() => (
          <div className="p-2">
            <p className="font-bold my-2">Υποομάδες</p>
            <MtrSubgroups />
          </div>
        )}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        dataKey="_id"
        filters={filters}
        paginatorRight={true}
        removableSort
        onFilter={(e) => setFilters(e.filters)}
        //edit:
        size="small"
        loading={loading}
        editMode="row"
      >
        {user?.role === "admin" ? (
          <Column
          style={{ width: "40px" }}
            body={(rowData) => (
              <Actions 
                label="Τροποποίηση Ομάδας"
                onEdit={() => onEdit(rowData)}
                >
                
              </Actions>
            )}
          ></Column>
        ) : null}

        <Column
          bodyStyle={{ textAlign: "center" }}
          expander={allowExpansion}
          style={{ width: "20px" }}
        />
        <Column
          field="groupIcon"
          header="Εικονίδιο"
          body={logoTemplate}
          style={{ width: "50px" }}
        ></Column>
        <Column
          field="groupImage"
          header="Φωτογραφία Ομάδας"
          body={imageTemplate}
          style={{ width: "50px" }}
        ></Column>
        <Column field="category.categoryName" header="Κατηγορία"></Column>
        <Column field="groupName" header="Όνομα Ομάδας"></Column>
        <Column field="englishName" header="Μετάφραση"></Column>

        <Column
          field="updatedFrom"
          sortable
          header="Τροποποιήθηκε Από"
          style={{ width: "90px" }}
          body={UpdatedFromTemplate}
        ></Column>
      </DataTable>

      <DialogGroup
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

