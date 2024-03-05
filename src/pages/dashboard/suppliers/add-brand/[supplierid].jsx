
import AdminLayout from "@/layouts/Admin/AdminLayout"
import { MarkesGrid } from "@/components/markesGrid"
import { useRouter } from "next/router"

const Page  = () => {
    const router = useRouter();
    const { supplierid } = router.query;
    return (
        <AdminLayout>
            <MarkesGrid supplierID={supplierid} />
        </AdminLayout>
    )
}

export default Page;