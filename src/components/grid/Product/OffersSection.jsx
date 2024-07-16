"use client"
import React, {useState, useEffect} from "react";
import XLSXDownloadButton from "@/components/exportCSV/Download";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import axios from "axios";
import CreatedAt from "@/components/grid/CreatedAt";
import {useRouter} from "next/navigation";
const OffersSection = () => {
    return (
        <div>
            <OfferGrid/>
            <ClientHolder/>
        </div>
    );
};

const OfferGrid = () => {
    const [data, setData] = useState([]);
    const router = useRouter()
    const [loading, setLoading] = useState({
        grid: false,
        delete: false,
    });
    const [total, setTotal] = useState(0);
    const [refetch, setRefetch] = useState(false);
    // const [statuses] = useState(["pending", "done", "rejected"]);

    const handleFetch = async () => {
        setLoading((prev) => ({...prev, grid: true}));
        let res = await axios.post("/api/singleOffer", {
            action: "findOffers",
            clientName: null,
        });
        setData(res.data.result);
        setLoading((prev) => ({...prev, grid: false}));
    };

    useEffect(() => {
        handleFetch();
    }, [refetch]);

    useEffect(() => {
        if (data.length === 0) return;
        let _total = 0;
        data.forEach((item) => {
            item.products.forEach((product) => {
                _total += parseFloat(product.PRICE * product.QTY1);
            });
        });
        setTotal(_total);
    }, [data]);

    const Header = () => {
        const _newdata = [];

        data.forEach((item) => {
            item.products.forEach((product) => {
                _newdata.push({
                    CLIENT_NAME: item.clientName,
                    CLIENT_EMAIL: item.clientEmail,
                    SALDOCNUM: item.SALDOCNUM,
                    CREATED_AT: item.createdAt,
                    PRODUCT_NAME: product.NAME,
                    PRICE: product.PRICE,
                    QTY1: product.QTY1,
                    TOTAL_PRICE: product.TOTAL_PRICE,
                });
            });
        });
        return (
            <div className="flex align-items-center justify-content-between">
                <XLSXDownloadButton data={_newdata} fileName="offer"/>
            </div>
        );
    };
    const header = Header();

    const Footer = () => {
        return (
            <div className="flex p-2">
                <span className="font-normal text-base">Σύνολο Προσφορών:</span>
                <span className="ml-1 text-base	">{total}€</span>
            </div>
        );
    };

    const handleView = (clientName) => {
            router.push("/dashboard/clients/offers/" + clientName)
        }

    return (
        <div className="">
            <p className="stepheader">Προσφορές</p>
            <DataTable
                loading={loading.grid}
                header={header}
                editMode="row"
                value={data}
                rows={8}
                paginator
                rowsPerPageOptions={[8, 16, 24]}
                paginatorRight
                tableStyle={{minWidth: "50rem"}}
                showGridlines
                className="p-datatable-sm"
                footer={Footer}
            >
                <Column field="clientName" header="Όνομα"></Column>
                <Column field="SALDOCNUM" header="Αρ. Παραστατικού"></Column>
                <Column
                    field="createdAt"
                    body={CreatedAt}
                    header="Ημερομηνία Δημ."
                ></Column>
                <Column
                    header="Κατάσταση"
                    field="status"
                    body={Status}
                    style={{width: "160px"}}
                    // editor={(options) => statusEditor(options)}
                ></Column>
                <Column
                    header="Σύνολο Προσφοράς"
                    body={RowTotal}
                    style={{width: "160px"}}
                ></Column>
                <Column
                    field="createdFrom"
                    style={{width: "40px"}}
                    body={({clientName}) => (
                        <div onClick={() => handleView(clientName)}>
                            <i className="pi pi-eye text-primary" />
                        </div>
                    )}
                >
                </Column>
            </DataTable>
        </div>
    );
};

const ClientHolder = ({NAME}) => {
    const [data, setData] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const router = useRouter();
    const handleFetch = async () => {
        setLoading(true);
        let res = await axios.post("/api/createOffer", {
            action: "findClientHolder",
            clientName: null,
        });
        setData(res.data.result);
        setLoading(false);
    };

    useEffect(() => {
        if (data.length > 0) {
            let totalForAllOffers = data.reduce((accumulator, offer) => {
                let totalForOffer = offer.holders.reduce((holderTotal, holder) => {
                    let productsTotal = holder.products.reduce(
                        (productTotal, product) => {
                            return productTotal + parseFloat(product.PRICE * product.QTY1);
                        },
                        0
                    );

                    return holderTotal + productsTotal;
                }, 0);

                return accumulator + totalForOffer;
            }, 0);

            setTotal(totalForAllOffers);
        }
    }, [data]);

    useEffect(() => {
        handleFetch();
    }, [refetch, NAME]);


    const handleView = (clientName) => {
        router.push("/dashboard/clients/offers/" + clientName)
    }

    const Header = () => {
        let _newdata = [];
        return (
            <div className="flex align-items-center justify-content-between">
                <XLSXDownloadButton data={_newdata} fileName="offer"/>
            </div>
        );
    };
    const header = Header();

    const Footer = () => {
        return (
            <div className="flex p-2">
                <span className="font-normal text-base">Σύνολο Προσφορών:</span>
                <span className="ml-1 text-base	">{total}€</span>
            </div>
        );
    };

    return (
        <div className="mt-4 mb-4">
            <p className="stepheader">Προσφορές Πολλαπών Επιλογών</p>
            <DataTable
                loading={loading}
                value={data}
                header={header}
                footer={Footer}
                showGridlines
                rows={8}
                paginator
                rowsPerPageOptions={[8, 16, 24]}
                paginatorRight
                tableStyle={{minWidth: "50rem"}}
                className="p-datatable-sm"
            >
                <Column header="Όνομα Πελάτη" field="clientName"></Column>
                <Column
                    header="Aριθμός Προσφοράς"
                    headerStyle={{width: "170px"}}
                    field="num"
                ></Column>
                <Column
                    header="Αρ. Παραστατικού"
                    field="SALDOCNUM"
                    style={{width: "120px"}}
                ></Column>
                <Column header="Ημ. Δημιουργίας" field="createdAt" body={CreatedAt}></Column>
                {/* <Column field="createdFrom" body={CreatedFrom}  header="Created From" style={{width: '60px'}}></Column> */}
                <Column
                    header="Κατάσταση"
                    field="status"
                    body={Status}
                    style={{width: "160px"}}
                ></Column>
                <Column
                    header="Σύνολο Προσφοράς"
                    body={RowTotalMultiOffer}
                    style={{width: "160px"}}
                ></Column>
                <Column
                    field="createdFrom"
                    style={{width: "40px"}}
                    body={({clientName}) => (
                        <div onClick={() => handleView(clientName)}>
                            <i className="pi pi-eye text-primary" />
                        </div>
                    )}
                >
                </Column>
            </DataTable>
        </div>
    );
};

const RowTotalMultiOffer = ({holders}) => {
    let total = 0;
    for (let holder of holders) {
        for (let product of holder.products) {
            total += parseFloat(product.PRICE * product.QTY1);
        }
    }
    return (
        <div>
            <span>{total}€</span>
        </div>
    );
};
const RowTotal = ({products}) => {
    let total = 0;
    for (let item of products) {
        total += parseFloat(item.PRICE * item.QTY1);
    }
    return (
        <div>
            <span>{total}€</span>
        </div>
    );
};


const Status = ({status}) => {
    let color;
    if (status === "created") color = "bg-green-500";
    if (status === "pending") color = "bg-green-500";
    if (status === "sent") color = "bg-blue-500";
    if (status === "done") color = "bg-orange-500";
    if (status === "rejected") color = "bg-red-500";

    return (
        <div className="flex align-items-center ">
      <span
          className={`mt-1 ${color} border-circle`}
          style={{width: "5px", height: "5px"}}
      ></span>
            <span className="ml-2 text-600">{status.toUpperCase()}</span>
        </div>
    );
};

export default OffersSection;
