import { Button } from 'primereact/button';
import React, {useRef} from 'react';
import { CSVLink, CSVDownload } from "react-csv";

const CSVExport = ({ holders, email, name}) => {
  // Create a nested array to structure the CSV data
  const csvLinkRef = useRef(); // Create a ref for the CSVLink component

let newData = []
holders.map((holder) => {
   console.log(holder)
   holder.products.map((product) => {
        newData.push({
            name: name,
            email: email,
            holderName: holder.name,
            productName: product.NAME,
            productPrice: product.PRICE,
            productQuantity: product.QTY1,
            productTotalPrice: product.TOTAL_PRICE

        })

   })
})
console.log(newData)
const headers = [
    { label: 'Όνομα Πελάτη', key: 'name' },
    { label: 'Εmail Πελάτη', key: 'email' },
    { label: 'Όνομα Holder', key: 'holderName' }, // You can rename this to match your data
    { label: 'Προϊόν', key: 'productName' }, // You can rename this to match your data
    { label: 'Τιμή', key: 'productPrice' }, // You can rename this to match your data
    { label: 'Ποσότητα', key: 'productQuantity' }, // You can rename this to match your data
    { label: 'Συνολική Τιμή', key: 'productTotalPrice' }, // You can rename this to match your data
  ];

  const handleDownloadClick = () => {
    if (csvLinkRef.current) {
      csvLinkRef.current.link.click();
    }
  };

  return (
    <div>
    <Button
        label="Download CSV"
        icon="pi pi-download"
        className="w-full p-button-warning"
        onClick={handleDownloadClick}
      />
      <CSVLink
        data={newData}
        headers={headers}
        filename={'client_data.csv'}
        ref={csvLinkRef}
        style={{ display: 'none' }} // Hide the CSVLink element
      />
    </div>
  );
  }

 



export default CSVExport;