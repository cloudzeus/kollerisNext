import React from "react";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import MtrGroups from "@/components/Pages/MTRGROUPS";

export default function Groups() {
  return (
    <AdminLayout>
      <p className="stepheader">Oμάδες</p>

      <MtrGroups />
    </AdminLayout>
  );
}

