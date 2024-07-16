"use client";
import React, { useState, useEffect, useRef} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import UserRoleChip from "@/components/RoleChip";
import GridIconTemplate from "@/components/grid/gridIconTemplate";
import { useSession } from "next-auth/react";
import { Actions } from "@/components/Actions/Actions";
import { useToast } from "@/_context/ToastContext";
import { DialogUser } from "@/components/Pages/Dialogs/DialogUser";
import { OverlayPanel } from "primereact/overlaypanel";


export default function UsersPage() {
  const { showMessage } = useToast();
  const { data: session } = useSession();
  const role = session?.user?.role;
  //DIALOG:
  const [dialog, setDialog] = useState({
    state: false,
    isEdit: false,
  });
  const [data, setData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const handleFetch = async () => {
    try {
      setLoading(true);
      const resp = await axios.post("/api/user/apiUser", { action: "findAll" });
      setData(resp.data.result);
    } catch (error) {
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message: error?.response?.data?.error || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [submitted]);

  //TEMPLATES
  const renderHeader = () => {
    const value = filters["global"] ? filters["global"].value : "";
    return (
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={value || ""}
          onChange={(e) => onGlobalFilterChange(e)}
          placeholder="Αναζήτηση"
        />
      </span>
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

  //Add product
  const openNew = () => {
    setSubmitted(false);
    setDialog((prev) => ({ ...prev, state: true, isEdit: false }));
  };

  const hideDialog = () => {
    setDialog((prev) => ({ ...prev, state: false, isEdit: false }));
  };

  const onDelete = async (id) => {
    try {
      let res = await axios.post("/api/user/apiUser", {
        action: "delete",
        id: id,
      });
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: "Ο χρήστης διαγράφτηκε με επιτυχία",
      
      })
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message: e?.response?.data?.error || e.message,
      });
    } finally {
      setSubmitted((prev) => !prev);
    }
  };

  return (
    <AdminLayout>
      <p className="stepheader">Χρήστες</p>
      {role === "admin" ? (
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
      ) : null}
      <DataTable
        className="p-datatable-sm"
        header={header}
        value={data}
        paginator
        rows={20}
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
        {role === "admin" ? (
          <Column
            body={(rowData) => (
              <Actions
                label="Τροποποίηση Xρήστη"
                onEdit={() => onEdit(rowData)}
              >
                <Button
                  onClick={() => onDelete(rowData._id)}
                  label="Διαγραφή"
                  severity="danger"
                  icon="pi pi-trash"
                  className="w-full"
                />
              </Actions>
            )}
            bodyStyle={{ textAlign: "center" }}
            style={{ width: "40px" }}
          ></Column>
        ) : null}
        <Column field="firstName" header="'Ονομα" body={nameTemplate}></Column>
        <Column field="lastName" header="Επώνυμο" sortable></Column>
        <Column
          field="details"
          body={(row) => (
            <GridDetails data={row} />
          )}
          header="Λεπτομέρειες"
        ></Column>
        <Column
          field="email"
          header="Email"
          tableStyle={{ width: "5rem" }}
          body={emailTemplate}
        ></Column>
        <Column
          field="createdAt"
          body={userCreate}
          header="Δημιουργήθηκε"
          tableStyle={{ width: "5rem" }}
        ></Column>
        <Column
          field="role"
          header="Ρόλος"
          tableStyle={{ width: "5rem" }}
          body={(data) => UserRoleChip(data.role)}
        ></Column>
      </DataTable>
      <DialogUser
        isEdit={dialog.isEdit}
        data={rowData}
        dialog={dialog.state}
        hideDialog={hideDialog}
        setSubmitted={setSubmitted}
      />
    </AdminLayout>
  );
}

const emailTemplate = (data) => {
  return (
    <div>
      <GridIconTemplate
        value={data.email}
        icon="pi pi-envelope"
        color="#0d6efd"
      />
    </div>
  );
};
const nameTemplate = (data) => {
  return (
    <div>
      <GridIconTemplate
        value={data.firstName}
        icon="pi pi-user"
        color="#0d6efd"
      />
    </div>
  );
};

const userCreate = ({ createdAt }) => {
  return createdAt.split("T")[0];
};

const GridDetails = (data) => {
  const op = useRef(null);
  return (
      <div className="flex" onClick={(e) => op.current.toggle(e)}>
        <i className="pi pi-info-circle  "></i>
            <div className=' ml-2'>
                <span className="value">{data.title}</span>
                <i className="pi pi-angle-down"></i>
            </div>
            <OverlayPanel className='shadow-5 ' ref={op}>
            <DataTable
        value={[data]}
        rows={8}
        rowsPerPageOptions={[5, 10, 25, 50]}
        showGridlines
        dataKey="_id"
        removableSort
        onFilter={(e) => setFilters(e.filters)}
        editMode="row"
      >
        <Column field="address.country" header="'Χώρα"></Column>
        <Column 
          field="address.city" header="Πόλη"></Column>
        <Column field="address.address" header="Διεύθυνση"></Column>
        <Column field="address.postalcode" header="Τ.Κ."></Column>
        <Column field="phones.landline" header="Σταθερο Τηλέφωνο"></Column>
        <Column field="phones.mobile" header="Κινητό"></Column>
      </DataTable>
            </OverlayPanel>
      </div>
      
  );
};
