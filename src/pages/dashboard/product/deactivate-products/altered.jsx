"use client";
import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import axios from "axios";
import { useToast } from "@/_context/ToastContext";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [submitedData, setSubmitedData] = useState({
    result: [],
    batchCount: 0,
    totalBunches: 0,
    softoneResponse: null,
    message: "",
    success: false,
  });
  const toast = useRef(null);
  const { showMessage } = useToast();
  const router = useRouter();
  const { mongoKeys, newData } = useSelector(
    (state) => state.deactivateProducts
  );

  useEffect(() => {
    if (!newData || !newData?.length || !mongoKeys) {
      router.push("/dashboard/product");
      return;
    }
  }, [newData]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const batchSize = 50; // Define your batch size
      const batches = [];
      for (let i = 0; i < newData.length; i += batchSize) {
        const batch = newData?.slice(i, i + batchSize);
        batches.push(batch);
      }
      setSubmitedData((prev) => ({
        ...prev,
        totalBunches: batches.length,
      }));
      for (let batch of batches) {
        const res = await axios.put("/api/deactivateUploadedProducts/update",
          {
            data: batch,
            mongoKeys,
          }
        );
        setSubmitedData((prev) => ({
          ...prev,
          result: [...prev.result, ...res.data.result],
          batchCount: prev.batchCount + 1,
          softoneResponse: res.data.softoneResponse,
        }));
      }
      showMessage({
        severity: "success",
        summary: "Επιτυχία",
        message: "Η αποστολή ολοκληρώθηκε",
      });
    } catch (e) {
      showMessage({
        severity: "error",
        summary: "Aποτυχία",
        message: e?.response?.data?.error || e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Toast ref={toast} />
        <DeactivateTable
          loading={loading}
          data={newData}
          mongoKeys={mongoKeys}
          handleSubmit={handleSubmit}
          submitedData={submitedData}
        />
        {submitedData.result.length > 0 && (
            <SubmitedTable data={submitedData} loading={loading} />
        )}
    </AdminLayout>
  );
}

const DeactivateTable = ({ data, mongoKeys, handleSubmit, loading, submitedData }) => {
  return (
    <DataTable
      header={() => (
        <div>
          <Button
            size="small"
            disabled={submitedData.result.length > 0}
            loading={loading}
            label="Απενεργοποίηση Προϊόντων"
            icon="pi pi-save"
            className="p-button-danger"
            onClick={handleSubmit}
          />
        </div>
      )}
      showGridlines
      loading={loading}
      paginator
      rows={10}
      rowsPerPageOptions={[10, 50, 100, 200, 500]}
      value={data}
      tableStyle={{ minWidth: "50rem" }}
    >
      <Column
        field={mongoKeys?.mappingKey?.key}
        header={mongoKeys?.mappingKey?.label}
      />
    </DataTable>
  );
};

const SubmitedTable = ({ data }) => {
  const router = useRouter();
  return (
    <DataTable
      className="mt-4"
      header={() => (
        <div className="flex align-items-center justify-content-between">
          <Button
            size="small"
            label="Επιστροφή στα Προϊόντα"
            icon="pi pi-arrow-left"
            onClick={() => router.push("/dashboard/product")}
          />
          <div>
            <span className="text-500">Ολοκληρωμένες Παρτίδες: </span>
            <span>
              {data.batchCount} / {data.totalBunches}
            </span>
          </div>
        </div>
      )}
      showGridlines
      paginator
      rows={20}
      rowsPerPageOptions={[20, 50, 100, 200, 500]}
      value={data.result}
      tableStyle={{ minWidth: "50rem" }}
    >
     
      <Column field="code" header="Κωδικός" />
      <Column field="name" header="Όνομα" />
      <Column field="message" header="Μήνυμα" />
      <Column field="shouldDelete" header="Προς Διαγραφή" body={(row) => (
        <DeletedQueue  status={row.shouldDelete} />
      )} />
      <Column field="systemDelete" header="Σύστημα" body={(row) => (
        <StatusTemplate  status={row.shouldDelete} />
      )} />
      <Column field="deactivatedSoftone" header="Softone" body={(row) => (
        <StatusTemplate  status={row.deactivatedSoftone} />
      )} />
      <Column field="MTRL" header="MTRL" />
       {/* <Column field="imagesDeleted" header="Διαγραφή Φωτογραφιών" /> */}
    </DataTable>
  );
};


const DeletedQueue = ({status}) => {
  return (
    <div>
      {status ? (
        <span className={`p-badge p-badge-info`}>
          Προς Διαγραφή
        </span>
      ) : null}
    </div>
  );
}

const StatusTemplate = ({ status }) => {
  return (
    <div >
        {status ? (
           <span className={`p-badge p-badge-success`}>
           Επιτυχία
         </span>
        ): null}
    </div>
  );
};
