import React from "react";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import SelectedProducts from "@/components/grid/SelectedProducts";
import ProductSearchGrid from "@/components/grid/ProductSearchGrid";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";
import axios from "axios";
import { useRouter } from "next/router";
import { useToast } from "@/_context/ToastContext";

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const { selectedProducts, mtrLines } = useSelector((state) => state.products);
  const {showMessage} = useToast();

    console.log({id})
 
  const onClick = async () => {
    try {
     await axios.post("/api/singleOffer", {
        action: "addMore",
        id: id,
        mtrLines: mtrLines,
      });
      router.push("/dashboard/offer");
    } catch(e) {
      showMessage({
        severity: "error",
        summary: "Error",
        message: e.message
      })
    }
   
  };
  return (
    <AdminLayout>
      <p className="stepheader">Προσθήκη Περισσότερων</p>
      
      <ProductSearchGrid />
      {selectedProducts.length ? (
        <>
          <div className="mt-4">
            <p className="stepheader">Επιλεγμένα Προϊόντα</p>
          </div>
          <SelectedProducts />
          <Button 
            className="mt-2"
            label="Ολοκλήρωση" 
            onClick={onClick} 
            icon="pi pi-check" 
            />
        </>
      ) : null}
    </AdminLayout>
  );
};

export default Page;
