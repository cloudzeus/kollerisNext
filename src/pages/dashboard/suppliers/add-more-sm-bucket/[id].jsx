"use client";
import React from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import ProductSearchGrid from "@/components/grid/ProductSearchGrid";
import SelectedProducts from "@/components/grid/SelectedProducts";

import { useToast } from "@/_context/ToastContext";

const Page = () => {
  const router = useRouter();
  // const { data: session, update } = useSession();
  // let user = session?.user?.user;
  const { id } = router.query;
  const { selectedProducts, mtrLines } = useSelector((state) => state.products);
  const {showMessage} = useToast()

  const handleFinalSubmit = async () => {
      try {
        await axios.post("/api/createSmallOrder", {
          action: "addMore",
          mtrLines: mtrLines,
          id: id,
        });
        router.push(`/dashboard/suppliers/small-orders`);
      } catch(e) {
        showMessage(
          {
            severity: "error",
            summary: "Error",
            message: e.message
          }
        )
      }
  };
  return (
    <AdminLayout>
      <p className="stepheader">Προσθήκη Προϊόντων Στον Κουβά</p>
      <ProductSearchGrid />
      {selectedProducts.length ? (
        <div className="mt-4">
          <p className="stepheader">Επιλεγμένα Προϊόντα</p>
          <SelectedProducts />
          <div className="mt-2 flex">
            <Button
              className="mr-2"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => router.back()}
            />
            <Button
              className="mr-2"
              label="Προσθήκη"
              icon="pi pi-plus"
              onClick={handleFinalSubmit}
            />
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
};

export default Page;
