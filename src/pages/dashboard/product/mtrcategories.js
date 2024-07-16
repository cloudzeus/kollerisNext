import React from 'react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import MtrCategories from '@/components/Pages/MTRCATEGORIES';


export default function Page() {
    return (
        <AdminLayout>
            <p className="stepheader">Εμπορικές κατηγορίες</p>
            <MtrCategories />
        </AdminLayout>
    );
}
















