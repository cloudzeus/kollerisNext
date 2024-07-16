import CustomersGrid from "@/components/grid/clientGrid";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { setSelectedClient } from "@/features/impaofferSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";
import ClientDetails from "@/components/multiOffer/ClientDetails";
import { Button } from "primereact/button";
const Page = () => {
    const { selectedClient } = useSelector(state => state.impaoffer)
    const dispatch = useDispatch();
    const router = useRouter()
    
    useEffect(() => {
        dispatch(setSelectedClient(null))
    }, [])
    return (
        <AdminLayout>
            <p className="stepheader">Eπιλογή Πελάτη</p>
            <CustomersGrid />
            <ClientDetails />
            {selectedClient ? (<Button className='mt-3' label='Επόμενο' severity="success" onClick={() => router.push('/dashboard/offer/select-products')} />
            ) : null}
        </AdminLayout>
    )
}

export default Page;