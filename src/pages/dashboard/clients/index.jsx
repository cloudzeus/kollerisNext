import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";
import { setGridRowData } from "@/features/grid/gridSlice";
import SearchInput from "@/components/Forms/SearchInput";
import { Actions } from "@/components/Actions/Actions";
import { useSession } from "next-auth/react";
import { DialogClient } from "@/components/Pages/Dialogs/DialogClient";

export default function Clients() {
  const [dialog, setDialog] = useState({
    state: false,
    isEdit: false,
  });
  const [rowData, setRowData] = useState(null);

  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [data, setData] = useState([]);
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [sortOffers, setSortOffers] = useState(0);
  const [searchTerm, setSearchTerm] = useState({
    name: "",
    afm: "",
    address: "",
    phone01: "",
    phone02: "",
    email: "",
  });
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 50,
    page: 1,
  });
  const session = useSession();
  const user = session.data?.user;
  const onPage = (event) => {
    setlazyState(event);
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      let { data } = await axios.post("/api/clients/apiClients", {
        action: "fetchAll",
        skip: lazyState.first,
        limit: lazyState.rows,
        searchTerm: searchTerm,
        sortOffers: sortOffers,
      });
      setData(data.result);
      setTotalRecords(data.totalRecords);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchClients();
    })();
  }, [lazyState.rows, lazyState.first, searchTerm, submitted, sortOffers]);

  const handleSearchTerm = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setSearchTerm((prev) => ({ ...prev, [name]: value }));
  };

  //handle sort offers:
  const onSort = () => {
    setSortOffers((prev) => {
      if (prev === 0) return 1;
      if (prev === 1) return -1;
      if (prev === -1) return 0;
    });
  };



  const onEdit = async (data) => {
    setRowData(data);
    dispatch(setGridRowData(data));
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
    <AdminLayout>
      <Toast ref={toast} />
      <p className="stepheader">Πελάτες</p>
      {/* <Toolbar
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
      ></Toolbar> */}
      <DataTable
        lazy
        totalRecords={totalRecords}
        first={lazyState.first}
        onPage={onPage}
        rows={lazyState.rows}
        size="small"
        value={data}
        paginator
        rowsPerPageOptions={[20, 50, 100, 200, 500]}
        dataKey="_id"
        paginatorRight={true}
        loading={loading}
        filterDisplay="row"
        showGridlines
      >
        {user?.role === "admin" ? (
          <Column
            body={(rowData) => (
              <Actions 
              label="Τροποποίηση Πελάτη"
              onEdit={() => onEdit(rowData)}>

              </Actions>
            )}
          ></Column>
        ) : null}
        <Column
          body={ShowOffers}
          filter
          showFilterMenu={false}
          filterElement={() => {
            return <FilterOffers onSort={onSort} sortOffers={sortOffers} />;
          }}
          style={{ width: "40px" }}
        ></Column>
        <Column
          field="NAME"
          filter
          showFilterMenu={false}
          header="Ονομα"
          filterElement={() => (
            <SearchInput
              name="name"
              value={searchTerm.name}
              handleSearch={handleSearchTerm}
            />
          )}
        ></Column>
        <Column
          field="AFM"
          filter
          showFilterMenu={false}
          filterElement={() => (
            <SearchInput
              name="afm"
              value={searchTerm.afm}
              handleSearch={handleSearchTerm}
            />
          )}
          header="ΑΦΜ"
          style={{ width: "120px" }}
        ></Column>
        <Column
          header="Διεύθυνση"
          field="ADDRESS"
          filter
          showFilterMenu={false}
          style={{ width: "120px" }}
          filterElement={() => (
            <SearchInput
              name="address"
              value={searchTerm.address}
              handleSearch={handleSearchTerm}
            />
          )}
        ></Column>
        <Column
          field="EMAIL"
          filter
          showFilterMenu={false}
          header="Email"
          style={{ width: "120px" }}
          filterElement={() => (
            <SearchInput
              name="email"
              value={searchTerm.email}
              handleSearch={handleSearchTerm}
            />
          )}
        ></Column>
        <Column
          field="PHONE01"
          filter
          showFilterMenu={false}
          header="Τηλέφωνο"
          style={{ width: "120px" }}
          filterElement={() => (
            <SearchInput
              name="phone01"
              value={searchTerm.phone01}
              handleSearch={handleSearchTerm}
            />
          )}
        ></Column>
        <Column
          field="PHONE02"
          filter
          showFilterMenu={false}
          header="Τηλέφωνο 2"
          style={{ width: "120px" }}
          filterElement={() => (
            <SearchInput
              name="phone02"
              value={searchTerm.phone02}
              handleSearch={handleSearchTerm}
            />
          )}
        ></Column>
        <Column
          field="ZIP"
          header="Ταχ.Κώδικας"
          style={{ width: "40px" }}
        ></Column>
      </DataTable>
      <DialogClient
        data={rowData}
        isEdit={dialog.isEdit}
        dialog={dialog.state}
        setSubmitted={setSubmitted}
        hideDialog={hideDialog}
      />
    </AdminLayout>
  );
}

const FilterOffers = ({ onSort, sortOffers }) => {
  return (
    <div>
      <div className="ml-3">
        {sortOffers === 0 ? (
          <i className="pi pi-sort-alt" onClick={onSort}></i>
        ) : null}
        {sortOffers === 1 ? (
          <i className="pi pi-sort-amount-up" onClick={onSort}></i>
        ) : null}
        {sortOffers === -1 ? (
          <i className="pi pi-sort-amount-down-alt" onClick={onSort}></i>
        ) : null}
      </div>
    </div>
  );
};

const ShowOffers = ({ OFFERSTATUS, NAME, _id }) => {
    const router = useRouter()
  const handleClick = () => {
    const encodedString = encodeURIComponent(NAME);
    router.push(`/dashboard/clients/offers/${encodedString}`);
  };
  if (OFFERSTATUS) {
    return (
      <div
        className="flex cursor-pointer align-items-center justify-content-center p-0"
        onClick={handleClick}
      >
        <div
          className={`bg-green-600  border-round mr-1 mt-1 `}
          style={{ width: "4px", height: "4px" }}
        ></div>
        <span className="font-xm text-600" style={{ fontSize: "10px" }}>
          OFFERS
        </span>
      </div>
    );
  }
};
