import React from "react";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import ProductStats from "@/components/grid/ProductStats";
import OffersSection from "@/components/grid/Product/OffersSection";
import { ProductCard } from "@/components/grid/ProductStats";
const Page = () => {
  return (
    <AdminLayout>
      <div className="ml-2">
      
        <p className="stepheader">Προϊόν</p>

      </div>
      <div className="stats_grid">
        <div className="stats_col_1">
          <ProductStats />
        </div>
        <div className="stats_col_2">
          <ProductCard />
        </div>
      </div>
      <OffersSection />
    </AdminLayout>
  );
};

export default Page;
