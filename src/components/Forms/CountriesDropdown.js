import {use, useEffect, useState} from "react"
import axios from "axios"
import {Dropdown} from "primereact/dropdown"

export default function CountriesDropdown({selectedCountry, onChangeCountry, isEdit = false, required, error}) {

    const [options, setOptions] = useState([])
    const [value, setValue] = useState(null)

    useEffect(() => {
        if (isEdit) {
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
        const countries = await axios.post('/api/suppliers', {action: 'getCountries'})
        setOptions(countries.data.result)

    }

    useEffect(() => {
        handleFetchData();
    }, [])

    // let value = isEdit ? options.find(option => option.COUNTRY === selectedCountry) : selectedCountry
    return (
        <div className="mb-2">
            <label className={`mb-2 block ${error && "text-red-500"}`}>Χώρα {required && "*"}</label>
            <Dropdown
                className='w-full'
                value={value}
                onChange={onChange}
                options={options}
                optionLabel="NAME"
            />
            <p className="text-red-500 mt-1">{error}</p>
        </div>
    )
}