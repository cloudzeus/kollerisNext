
import { useEffect ,useState } from "react"
import CustomersGrid from "../clientGrid"
import {useSelector} from 'react-redux'
import { Button } from "primereact/button"
import axios from 'axios'
import SuppliersGrid from "@/components/suppliers/suppliersGrid"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
const SmallOrders = ({ orders }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {selectedProducts, mtrLines} = useSelector(state => state.products)
    const {selectedSupplier} = useSelector(state => state.supplierOrder)
    const { data: session } = useSession()
    let user = session?.user;

    const handleOffer = async () => {
        setLoading(true)
        const {data} = await axios.post('/api/createSmallOrder', {
            action: "createOrder",
            mtrLines: mtrLines,
            supplier: selectedSupplier,
            createdFrom: user?.lastName
        })
        setLoading(false)
        router.push(`/dashboard/suppliers/small-orders`)
    }

   

    return (
        <div>
            <SuppliersGrid />
            <Button disabled={!selectedSupplier} loading={loading} onClick={handleOffer} label="Δημιουργία Προσφοράς" className="mt-4"/>
        </div>
    )
}


export default SmallOrders