import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { useDispatch } from "react-redux";
import RegisterUserActions from "@/components/grid/GridRegisterUserActions";
import GridLogoTemplate from "@/components/grid/gridLogoTemplate";
import { useSession } from "next-auth/react";
import CreatedAt from "@/components/grid/CreatedAt";
import { useRouter } from "next/router";
import { ImageGrid } from "@/components/bunnyUpload/ImageGrid";
import { setGridData } from "@/features/catalogSlice";
import XLSX from "xlsx";
import { TabPanel, TabView } from "primereact/tabview";
import { DialogBrand } from "@/components/Pages/Dialogs/DialogBrand";
import { Actions } from "@/components/Actions/Actions";
import { useToast } from "@/_context/ToastContext";
import { setBrand } from "@/features/catalogSlice";
import Link from "next/link";


export default function Brands() {
  //DIALOG:
  const [dialog, setDialog] = useState({
    state: false,
    isEdit: false,
  });
  const [rowData, setRowData] = useState([]);
  const router = useRouter();
  const [fileLoading, setFileLoading] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const { data: session } = useSession();
  let user = session?.user;

  const handleFetch = async () => {
    setLoading(true);
    try {
      let resp = await axios.post("/api/product/apiMarkes", {
        action: "findAll",
      });
      setData(resp.data.markes);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [submitted]);

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

  const allowExpansion = (rowData) => {
    return rowData;
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Νέα Μάρκα"
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

  const onUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async (e, rowData) => {
    const brand = rowData?.softOne?.NAME;
   
    setFileLoading(true);
    let fileName = e.target.files[0].name;
    const reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = async (e) => {
      const data = e.target.result;
      try {
        let save = await axios.post("/api/saveCatalog", {
          action: "save",
          bunnyData: data,
          fileName: fileName,
          id: rowData?._id,
        });
      } catch (e) {
        showMessage({
          severity: "error",
          summary: "Σφάλμα",
          message: e?.response?.data?.error || e.message,
        });
      }
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      dispatch(setGridData(parsedData));
      dispatch(setBrand({
        MTRMARK_NAME:rowData?.softOne?.NAME,
        MTRMARK: rowData?.softOne?.MTRMARK 
      }))
      router.push(`/dashboard/catalogs/upload-catalog`);
    };
  };

  return (
    <AdminLayout>
      <div>
        <p className="stepheader">Μάρκες</p>
      </div>
      <Toolbar start={leftToolbarTemplate}></Toolbar>
      <DataTable
        size="small"
        header={header}
        value={data}
        paginator
        rows={8}
        rowsPerPageOptions={[20, 50, 100, 200, 500]}
        showGridlines
        rowExpansionTemplate={(data) => (
          <TabView>
            <TabPanel header="Φωτογραφίες">
              <Images id={data._id} />
            </TabPanel>
            <TabPanel header="Κατάλογοι">
              <BrandCatalogs
                setSubmitted={setSubmitted}
                data={data?.catalogs}
                id={data._id}
              />
            </TabPanel>
          </TabView>
        )}
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
                label="Τροποποίηση Μάρκας"
                onEdit={() => onEdit(rowData)}
              >
                <input
                  className="hiddenButton"
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => handleFileUpload(e, rowData)}
                />
                <Button
                  className="w-full"
                  severity="warning"
                  loading={fileLoading}
                  onClick={onUploadClick}
                  label="Ανέβασμα τιμοκατάλογου"
                  icon="pi pi-plus"
                ></Button>
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
          field="logo"
          header="Εικονίδιο"
          body={(data) => <GridLogoTemplate logo={data?.logo} />}
          style={{ width: "50px" }}
        ></Column>
        <Column field="softOne.NAME" header="Όνομα"></Column>
        <Column field="supplier.NAME" header="Προμηθευτής"></Column>
        <Column
          field="updatedFrom"
          header="Τροποποιήθηκε Από"
          style={{ width: "90px" }}
          body={UpdatedFromTemplate}
        ></Column>
      </DataTable>

      <DialogBrand
        isEdit={dialog.isEdit}
        data={rowData}
        dialog={dialog.state}
        hideDialog={hideDialog}
        setSubmitted={setSubmitted}
      />
    </AdminLayout>
  );
}

const BrandCatalogs = ({ setSubmitted, data }) => {
  const { showMessage } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (_id) => {
    try {
      await axios.post("/api/saveCatalog", {
        action: "deleteCatalog",
        id: _id,
      });
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


  const handleDownload = async (e, fileName) => {
    e.preventDefault();
    try {
      let res = await axios.post('/api/catalogs/getCatalog', {
        fileName: fileName
      })
    } catch (e) {
      console.log(e)
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message: e?.response?.data?.error || e.message,
      })
    }
   
  
  }
  return (
    <DataTable
      size="small"
      value={data}
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25, 50]}
      showGridlines
      dataKey="_id"
      paginatorRight={true}
      loading={loading}
    >
      <Column field="name" header="Όνομα" body={(rowData) => (
        <div>
          <Link target="_blank" href={`https://kolleris.b-cdn.net/catalogs/${rowData?.name}`} >
          <i  className="pi pi-download mr-2 text-blue-500 cursor-pointer"  />
          {rowData?.name}
          </Link>
        </div>
      )}></Column>
      <Column
        field="createAt"
        header="Όνομα"
        body={(row) => <CreatedAt createdAt={row.createdAt} />}
      ></Column>
      <Column
        header=""
        body={(row) => (
          <i
            className="pi pi-trash mr-2 text-red-500 mr-1 cursor-pointer"
            onClick={() => handleDelete(row._id)}
          />
        )}
        style={{ width: "30px" }}
      ></Column>
    </DataTable>
  );
};

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

const Images = ({ id }) => {
  const { showMessage } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [data, setData] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const createImagesURL = (files) => {
    let imagesNames = [];
    for (let file of files) {
      imagesNames.push({ name: file.name });
    }
    return imagesNames;
  };

  const handleFetch = async () => {
    try {
      let { data } = await axios.post("/api/product/apiMarkes", {
        action: "getImages",
        id: id,
      });
      setData(data.result);
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message: e?.response?.data?.error || e.message,
      });
    }
  };

  const onDelete = async (name, _id) => {
    try {
      let { data } = await axios.post("/api/product/apiMarkes", {
        action: "deleteImage",
        parentId: id,
        imageId: _id,
        name: name,
      });
      setRefetch((prev) => !prev);
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: data?.message || "Η εικόνα διαγράφτηκε επιτυχώς",
      });
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message: e?.response?.data?.error || e.message,
      });
    }
  };

  const onAdd = async () => {
    try {
      let imagesURL = createImagesURL(uploadedFiles);
      let { data } = await axios.post("/api/product/apiMarkes", {
        action: "addImages",
        id: id,
        imagesURL: imagesURL,
      });
      //USED BY IMAGE GRID:
      return data;
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message: e?.response?.data?.error || e.message,
      });
    } finally {
      setRefetch((prev) => !prev);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [id, refetch]);
  return (
    <div className="p-4">
      <ImageGrid
        data={data}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        onDelete={onDelete}
        onAdd={onAdd}
      />
    </div>
  );
};
