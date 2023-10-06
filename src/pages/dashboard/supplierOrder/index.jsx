import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Button } from "primereact/button";
import StepHeader from "@/components/ImpaOffer/StepHeader";
import { useRouter } from "next/router";
import OrdersTable from "@/components/SuppliersOrder/OrdersTable";
const SuppliersOrder = () => {
    const router = useRouter()
    return (
        <AdminLayout>
            <StepHeader  text="Δημιουργία Παραγγελίας σε Προμηθευτή" />
            <Button label="Δημιουργία Νέας Παραγγελίας" onClick={() => router.push('/dashboard/supplierOrder/createOrder')} />
            <OrdersTable />
        </AdminLayout>
    )   
}



export default SuppliersOrder;