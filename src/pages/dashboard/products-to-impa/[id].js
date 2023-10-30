'use client';
import AdminLayout from "@/layouts/Admin/AdminLayout"
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import ProductSearchGrid from "@/components/grid/ProductSearchGrid";
import StepHeader from "@/components/StepHeader";
import { useSelector, useDispatch } from "react-redux";
import { Toolbar } from "primereact/toolbar";
import { setSelectedProducts } from "@/features/productsSlice";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import axios from "axios";

const Page = () => {
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const toast = useRef(null);
    const dispatch = useDispatch();
    const { selectedProducts } = useSelector(store => store.products)
    const { id } = router.query;


    useEffect(() => {
        dispatch(setSelectedProducts([]))
    }, [])


    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Message Content', life: 3000 });
    }


    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    }

    const StartContent = () => {

        const handleClick = async () => {
            setLoading(true)
            console.log(selectedProducts)
            if(!id) {
                showError('Λάθος με την επιλογή Impa');
                router.back();
            }
            const res = await axios.post('/api/product/apiImpa', {
                action: 'correlateImpa',
                dataToUpdate: selectedProducts,
                id: id
            })
            if(res.data.success) {
                showSuccess();
                router.back();
            } else {
                showError(res.data.error);
            }
            console.log(res.data)
            setLoading(false)
        }
        return (
            <div>
                <Button loading={loading} disabled={!selectedProducts.length} label="Συσχετισμός Επιλεγμένων" className="p-button-success" onClick={ handleClick} />
            </div>
        )
    }
    return (
        <AdminLayout>
            <Toast ref={toast} />
            <div className="mt-2">
                <Button label="Πίσω" icon="pi pi-arrow-left" onClick={() => router.back()} />
            </div>
            <div className="mt-3">
                <StepHeader text="Προσθήκη προϊόντων σε impa" />
                <Toolbar start={StartContent } />
                <ProductSearchGrid />
            </div>
        </AdminLayout>
    )
}

export default Page;