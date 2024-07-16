import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { useDispatch } from "react-redux";
import RegisterUserActions from "@/components/grid/GridRegisterUserActions";
import GridLogoTemplate from "@/components/grid/gridLogoTemplate";
import { useSession } from "next-auth/react";
import MtrGroups from "@/components/Pages/MTRGROUPS";
import { Actions } from "@/components/Actions/Actions";
import { DialogCategory } from "../Dialogs/DialogCategory";

export default function MtrCategories() {
  const [dialog, setDialog] = useState({
    state: false,
    isEdit: false,
  });
  const [rowData, setRowData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [expandedRows, setExpandedRows] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  //Set the toggled columns
  const { data: session } = useSession();
  let user = session?.user;

  const handleFetch = async () => {
    setLoading(true);
    let res = await axios.post("/api/product/apiCategories", {
      action: "findAll",
    });
    setData(res.data.result);
    setLoading(false);
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

  const allowExpansion = (rowData) => {
    return rowData;
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
        rows={20}
        rowsPerPageOptions={[20, 50, 100, 200, 500]}
        showGridlines
        rowExpansionTemplate={() => <MtrGroups />}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
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
                label="Τροποποίηση Κατηγορίας"
                onEdit={() => onEdit(rowData)}></Actions>
            )}
          ></Column>
        ) : null}
        <Column
          bodyStyle={{ textAlign: "center" }}
          expander={allowExpansion}
          style={{ width: "20px" }}
        />
        <Column
          field="categoryIcon"
          header="Εικονίδιο"
          body={(row) => <GridLogoTemplate logo={row.categoryIcon} />}
          style={{ width: "30px" }}
        ></Column>
        <Column
          field="categoryImage"
          header="Φωτογραφία"
          body={(row) => <GridLogoTemplate logo={row.categoryImage} />}
          style={{ width: "40px" }}
        ></Column>
        <Column
          field="categoryName"
          header="Όνομα Εμπορικής Κατηγορίας"
          sortable
        ></Column>
        <Column field="englishName" header="Mετάφραση"></Column>
        <Column
          field="updatedFrom"
          header="Τροποποιήθηκε Από"
          body={UpdatedFromTemplate}
          style={{ width: "90px" }}
        ></Column>
      </DataTable>
      <DialogCategory
        data={rowData}
        isEdit={dialog.isEdit}
        dialog={dialog.state}
        setSubmitted={setSubmitted}
        hideDialog={hideDialog}
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
