import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { batch, useSelector } from "react-redux";
import axios from "axios";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import Link from "next/link";
import { Dialog } from "primereact/dialog";
import { useToast } from "@/_context/ToastContext";

const CatalogResults = () => {
  const [returnedProducts, setReturnedProducts] = useState({
    system_data: [],
    create_system: 0,
    update_system: 0,
    should_create: 0,
    should_update_system: 0,
    should_update_softone: 0,
    batchCount: 0,
    totalBantches: 0,
  });
  const { attributes, mongoKeys, newData } = useSelector(
    (state) => state.catalog
  );

  const [visible, setVisible] = useState(false);

  const footerContent = (
    <div>
      <Button
        label="Ακύρωση"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
    </div>
  );
  return (
    <AdminLayout>
      <p className="stepheader">Τελική μορφή Αρχείου</p>
      <Link
        href="#"
        className="text-blue-500 cursor-pointer my-2 underline inline-block"
        onClick={(e) => {
          setVisible(true);
        }}
      >
        Δείτε την αντιστοίχιση των κλειδιών
      </Link>
      <Dialog
        visible={visible}
        modal
        header={"Κλειδιά"}
        footer={footerContent}
        style={{ width: "25rem", height: "25rem", overflow: "auto" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="mb-6">
          <h3 className="text-lg">Custom Attributes:</h3>
          {attributes.map((attribute, index) => {
            return (
              <div className="my-3" key={index}>
                <p className="text-sm">
                  Αρχικό Κλειδί: <strong>{attribute.oldKey}</strong>
                </p>
                <p className="text-sm mt-1">
                  Τελικό Κλειδί: <strong>{attribute.name}</strong>
                </p>
                {index !== attributes.length - 1 && (
                  <div className="seperator"></div>
                )}
              </div>
            );
          })}
        </div>
        <div className="my-2">
          <h3 className="text-lg">Συσχετισμένα Κλειδία:</h3>
          {mongoKeys.map((key, index) => {
            return (
              <div className="my-2" key={index}>
                <p className="text-sm">
                  Αρχικό Κλειδί: <strong>{key.header}</strong>
                </p>
                <p className="text-sm mt-1">
                  Τελικό Κλειδί: <strong>{key.related}</strong>
                </p>
                {index !== key.length - 1 && <div className="seperator"></div>}
              </div>
            );
          })}
        </div>
      </Dialog>
      <Table
        setReturnedProducts={setReturnedProducts}
        returnedProducts={returnedProducts}
        mongoKeys={mongoKeys}
        attributes={attributes}
        data={newData}
      />
      {returnedProducts.system_data.length > 0 && (
        <ResultTable data={returnedProducts} />
      )}
    </AdminLayout>
  );
};

const Table = ({ data, mongoKeys, attributes, setReturnedProducts }) => {
  const [loading, setLoading] = useState(false);
  const {brand} = useSelector((state) => state.catalog);
  console.log({brand})
  //Supplier has changed to brand:
  const { showMessage } = useToast();
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const batchSize = 50;
      const batches = [];
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        batches.push(batch);
      }
      setReturnedProducts((prev) => ({
        ...prev,
        totalBantches: batches.length,
      }));
      for (let butch of batches) {
        const res = await axios.post("/api/catalogs/submit-data", {
          data: butch,
          brand: brand,
        });
        setReturnedProducts((prev) => {
          return {
            ...prev,
            system_data: [...prev.system_data, ...res.data.system_data],
            create_system: prev.create_system + res.data.create_system,
            update_system: prev.update_system + res.data.update_system,
            should_create: prev.should_create + res.data.should_create,
            should_update_system:
              prev.should_update_system + res.data.should_update_system,
            should_update_softone:
              prev.should_update_softone + res.data.should_update_softone,
            batchCount: prev.batchCount + 1,
          };
        });
      }
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: "Η αποστολή ολοκληρώθηκε",
      });
    } catch (e) {
      console.log(e)
      showMessage({
        severity: "error",
        summary: "Σφάλμα",
        message: e.response?.data?.message || e.message || "Κάτι πήγε στραβά",
      });
    } finally {
      setLoading(false);
    }
  };

  const attributeColumns = () => {
    const attributeKeys = attributes.map((attr) => attr.userLabel);
    return attributeKeys.map((key) => (
      <Column
        key={key}
        field={key}
        header={key}
        body={(rowData) => {
          const attribute = rowData.ATTRIBUTES.find(
            (attr) => attr.userLabel === key
          );
          return attribute ? attribute.value : "";
        }}
      />
    ));
  };
  return (
    <>
      <DataTable
        loading={loading}
        key={Math.random()}
        showGridlines
        paginator
        rows={20}
        rowsPerPageOptions={[20, 50, 100, 200]}
        value={data}
        tableStyle={{ minWidth: "50rem" }}
      >
        {mongoKeys.map((key) => {
          if (key.related === 0) return;
          return (
            <Column key={key.related} field={key.related} header={key.header} />
          );
        })}
        {attributeColumns()}
      </DataTable>

      <div className="mt-3">
        <Button
          loading={loading}
          label="Αποστολή"
          className="ml-2"
          onClick={handleSubmit}
        />
      </div>
    </>
  );
};

const ResultTable = ({ data }) => {
  if (!data) return;
  return (
    <>
      <div className="mt-4">
        <div className="upload_product_result">
          <span>Oλοκληρωμένες Παρτίδες: </span>
          <span className="font-bold">{`${data.batchCount} / ${data.totalBantches}`}</span>
        </div>
        <div className="upload_product_result">
          <span>Σύνολο Προϊόντων: </span>
          <span className="font-bold">{`${data.system_data.length}`}</span>
        </div>
        <div className="upload_product_result">
          <span>Δημιουργήθηκαν στο σύστημα: </span>
          <span className="font-bold">{`${data.create_system} / ${data.should_create}`}</span>
        </div>
        <div className="upload_product_result">
          <span>Τροποποιήθηκαν στο σύστημα: </span>
          <span className="font-bold">{`${data.update_system} / ${data.should_update_system}`}</span>
        </div>
        <div className="upload_product_result mb-4">
          <span>Τροποποιήθηκαν στο SOFTONE: </span>
          <span className="font-bold">{`${data.should_update_softone} / ${data.should_update_softone}`}</span>
        </div>
      </div>
      <DataTable
        value={data?.system_data}
        paginator
        rows={20}
        rowsPerPageOptions={[20, 50, 100, 200]}
        tableStyle={{ minWidth: "50rem" }}
        showGridlines
      >
        <Column field="MTRL" header="MTRL" />
        <Column field="name" header="Όνομα" />
        <Column field="code" header="Κωδικός" body={(row) => (
          <span className="font-bold">{row?.code}</span>
        ) } />
        <Column field="message" header="Μήνυμα" />
        <Column
          field="status"
          style={{ width: "100px"}}
          header="Αποστολή Για:"
          body={SendForStatus}
        />
        <Column
           style={{ width: "100px"}}
          field="success"
          header="Κατάσταση Συστήματος"
          body={StatusBody}
        />
        <Column
          field="softone"
          header="Τροποποίηση Softone"
          body={SoftoneStatusBody}
        />
      </DataTable>
    </>
  );
};

const SendForStatus = ({status}) => {
  return (
    <div className="">
    <span
      className={`p-badge ${
        status === "update" ? " p-badge-info" : "p-badge-success"
      }`}
    >
      {status}
    </span>
  </div>
  )
}
const StatusBody = ({ success }) => {
  return (
    <div className="">
      <span
        className={`p-badge ${success ? " p-badge-success" : "p-badge-danger"}`}
      >
        {success ? "Επιτυχία" : "Αποτυχία"}
      </span>
    </div>
  );
};

const SoftoneStatusBody = ({ softone }) => {
  return (
    <>
      {softone === "updated" ? (
        <div className={`uploaded_status uploaded_success`}>
          <i className={"pi pi-check"} />
        </div>
      ) : null}
    </>
  );
};
export default CatalogResults;
