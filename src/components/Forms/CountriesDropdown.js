import { use, useEffect, useState } from "react"
import axios from "axios"
import { Dropdown } from "primereact/dropdown"
export default function CountriesDropdown({selectedCountry, onChangeCountry, isEdit = false}) {
    const [options, setOptions ] = useState([])
    const [value, setValue] = useState(null)

    console.log({selectedCountry})
    useEffect(() => {

        if(isEdit) {
            let value = options.find(option => option.COUNTRY == selectedCountry);
            setValue(value)
        } else {
            setValue(selectedCountry)
        }
    }, [options])


  


    const onChange = (e) => {
        setValue(e.target.value)
        onChangeCountry(e)
    }

    const handleFetchData = async () => {
        const countries = await axios.post('/api/suppliers', { action: 'getCountries' })
        setOptions(countries.data.result)
       
    }

    useEffect(() => {
        handleFetchData();
    }, [])

    // let value = isEdit ? options.find(option => option.COUNTRY === selectedCountry) : selectedCountry
    return (
        <>
              <label className='mb-2 block'>Χώρα</label>
                   <Dropdown  
                    className='mb-2'
                     value={value} 
                     onChange={onChange} 
                     options={options} 
                     optionLabel="NAME"
                   />
        </>
    )
}