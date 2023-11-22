import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';

const ProductStats = () => {
    const [state, setState] = useState({
        totalProducts: 0,
        imageStat: 0,
        totalWithImages: 0,
        descriptions: 20,
    
    })
    const handleFetch = async () => {
        let {data} = await axios.post('/api/dashboard', {action: 'getStats'}) 
        console.log(data.result)  
        setState(data.result)
    }

    useEffect(() => {
        handleFetch()
    }, [])
  return (
    <div className='bg-white p-4 border-round'>
         <div className="card">
            <div className='mb-3'>
                <p className='text-lg font-bold'>Σύνολο Προϊόντων:</p>
                <span className='text-sm'>{state.totalProducts}</span>
                
            </div>
            <ProgressDiv  value={state.imageStat} total={state.totalWithImages} text="Προϊόντα με φωτογραφίες" />
            <ProgressDiv color={'#1ecbe1'}  value={state.inSoftoneStat} total={state.inSoftone} text="Προϊόντα και στα 2 συστήματα" />
            <ProgressDiv color={'orange'}  value={state.inSkroutzStat} total={state.inSkroutz} text="Στο Skroutz" />
            <ProgressDiv color={'#29e01f'}  value={state.activeProductsStat} total={state.activeProducts} text="Ενεργά προϊόντα" />
            <ProgressDiv color={'#786897'}  value={state.haveDescriptionsStat} total={state.haveDescriptions} text="Ενεργά προιόντα με περιγραφή" />
        </div>
    </div>
  )
}




const ProgressDiv = ({color, total, text, value}) => {
    return (
        <div className='grid mb-2'>
            <div className='col-12'>
                <div className='mb-2'>
                    <span className='font-bold'>{`${total} `}</span>
                    <span>{`${text} `}</span>
                  
                </div>
                <div className='flex align-items-center'>
                    <div className='w-full mr-3'>
                    <ProgressBar color={color} size="small" style={{ height: '10px', minWidth: '100px' }} value={value} showValue={false}></ProgressBar>
                    </div>
                  
                    <div className='w-2rem'>
                    <span className='font-bold text-xs' >{`${value && value.toFixed(2)}%`}</span>
                    </div>
                </div>
            </div>
          
        </div>
    )
}



export const ProductCard = () => {
    const [data, setData] = useState([])
    const [selectedFilter, setSelectedFilter] = useState(null);
    const filters = [
        { name: 'Προϊόντα στο softOne', filter: {SOFTONESTATUS: true} },
     
    ];

    const handleFetchInSoftone = async () => {
        let {data} = await axios.post('/api/dashboard', {action: 'fetchProducts', filter: selectedFilter}) 
        // setData(data.result)
    }

    useEffect(() => {
        handleFetchInSoftone()
    }, [selectedFilter])
    return (
        <div className="card bg-white flex flex-column p-3 h-full">
            <div className="card flex mb-3 ">
            <Dropdown value={selectedFilter} onChange={(e) => setSelectedFilter(e.value)} options={filters} optionLabel="name" 
                editable placeholder="Επιλογή Φίλτρου" className="w-full md:w-14rem" />
        </div>
            <DataTableDash data={data}/>
        </div>
    )
}

export const DataTableDash = ({data, childern}) => {
    return (
        <div className="card">
        <DataTable value={data} tableStyle={{ minWidth: '50rem' }}>
            <Column field="NAME" header="Προϊόν"></Column>
        </DataTable>
    </div>
    )
}


export default ProductStats