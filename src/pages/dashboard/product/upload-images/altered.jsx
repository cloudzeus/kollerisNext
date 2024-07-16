"use client"
import React, { useState,  useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import axios from "axios";
import { useToast } from "@/_context/ToastContext";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [submitedData, setSubmitedData] = useState({
    result: [],
    countSuccess: 0,
    totalProducts: 0,
    batchCount:0,
    totalBunches: 0,
  });
  const {showMessage} = useToast();
  const {mongoKeys, newData } = useSelector(
    (state) => state.uploadImages
  );

  useEffect(() => {
    if (!newData || !newData.length || !mongoKeys) {
      router.push("/dashboard/product");
      return;
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const batchSize = 100; // Define your batch size
      const batches = [];
      for (let i = 0; i < newData.length; i += batchSize) {
        const batch = newData.slice(i, i + batchSize);
        batches.push(batch);
      }
      setSubmitedData(prev=> ({
        ...prev,
        totalProducts: newData.length,
        totalBunches: batches.length,
      }))
      for (const batch of batches) {
        const { data } = await axios.put("/api/butchImages/update", {
          data: batch,
        });
        setSubmitedData(prev => ({
          ...prev,
          result: [...prev.result , ...data.result],
          countSuccess: prev.countSuccess + data.countSuccess,
          batchCount: prev.batchCount + 1,
        }))
      }
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: "Η αποστολή ολοκληρώθηκε με επιτυχία",
      })
      
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
  return (
    <AdminLayout>
        <ViewTable
          loading={loading}
          submitedData={submitedData}
          handleSubmit={handleSubmit}
          mongoKeys={mongoKeys}
          data={newData}
        />
       {submitedData.result.length > 0 && (
        <SubmitTable data={submitedData} />
       )}
     
    </AdminLayout>
  );
}

const ViewTable = ({ handleSubmit, mongoKeys, data, loading, submitedData }) => {
  return (
    <DataTable
      header={() => (
        <div>
          <Button
            disabled={submitedData.result.length > 0}
           loading={loading}
            size="small"
            label="Αποστολή"
            icon="pi pi-save"
            className="p-button-success"
            onClick={handleSubmit}
          />
        </div>
      )}
      showGridlines
      paginator
      rows={5}
      rowsPerPageOptions={[5, 20, 50, 100, 200, 500]}
      selectionMode="radiobutton"
      value={data}
      tableStyle={{ minWidth: "50rem" }}
    >
     
      <Column field={mongoKeys?.mappingKey?.key} header={mongoKeys?.mappingKey?.label} />
      {mongoKeys?.imageFields?.map((imageField, index) => (
          <Column
            key={index}
            field={`images.${index}.name`}
            header={`Φωτογραφία-${index}`}
          />
        ))}
    </DataTable>
  );
};

const SubmitTable = ({ data }) => {
  const router = useRouter();
  return (
    <DataTable
      paginator
      header={() => (
        <div className="flex justify-content-between">
          <Button
            size="small"
            label="Eπιστροφή"
            icon="pi pi-arrow-left"
            className="p-button-secondary"
            onClick={() => router.push("/dashboard/product")}
          />
          <div>
              <div>
                 <span className="text-500">Ανανεωμένα Προϊόντα: </span>
                  <span>{data.countSuccess} / {data.totalProducts}</span>
              </div>
              <div>
                 <span className="text-500">Ολοκληρωμένες Παρτίδες: </span>
                  <span>{data.batchCount} / {data.totalBunches}</span>
              </div>

          </div>
        </div>
      )}
      value={data.result}
      rows={20}
      showGridlines
      rowsPerPageOptions={[20, 50, 100, 200, 500]}
      selectionMode="radiobutton"
      tableStyle={{ minWidth: "50rem" }}
      className="mt-5"
    >
      <Column field={"NAME"} header={"Όνομα"} />
      <Column field={"code"} header={"Κωδικός"} />
      <Column
        sortable
        style={{ width: "100px" }}
        field={"success"}
        header={"Kατάσταση"}
        body={StatusTemplate}
      />
    </DataTable>
  );
};


const StatusTemplate = ({ success }) => {
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
