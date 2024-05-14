import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import Flag from 'react-world-flags'
import Input from './PrimeInput';


const countries = [
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
];
export default function InPlaceInput({
    label,
    name,
    mb,
    mt,
    control,
    required,
    error,
    type,
    state,
}) {
    const [show, setShow] = useState(false)
    const inputRef = useRef(null);
    const [selectedCountry, setSelectedCountry] = useState(null);


    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <Flag code={option.code} style={{ width: '29px', height: '13px' }} />
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const countryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <Flag code={option.code} style={{ width: '20px', height: '8px' }} />

                <div>{option.name}</div>
            </div>
        );
    };

    const panelFooterTemplate = () => {
        return (
            <div className="py-2 px-3">
                {selectedCountry ? (
                    <span>
                        <b>{selectedCountry.name}</b> selected.
                    </span>
                ) : (
                    'No country selected.'
                )}
            </div>
        );
    };

    const onClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setShow((prev) => (!prev))
    }

    const onLanguageClick= () => {
    }
    return (
        <div className="card mb-3 mt-3 surface-100 p-2">
            <button
                onClick={onClick}
                className='flex align-center mb-2 justify-center p-2 border-none border-round-xs'>
                <i className="text-xs text-600 pi pi-language" ></i>
                <p className='text-xs text-700 ml-2'>Mετάφραση</p>
            </button >
            {show ? (
                <div>
                    <div className="flex  justify-content-start">
                        <Dropdown 
                            size="small"
                            className='w-11'
                            value={selectedCountry} 
                            onChange={(e) => setSelectedCountry(e.value)} 
                            options={countries} 
                            optionLabel="name" 
                            placeholder="Select a Country"
                            valueTemplate={selectedCountryTemplate} 
                            itemTemplate={countryOptionTemplate} 
                            panelFooterTemplate={panelFooterTemplate} />
                            <Button onClick={onLanguageClick} w-3 size="small" className="ml-2" icon="pi pi-plus" aria-label="Filter" raised />
                    </div>
                    <Input 
                        name={name}
                        control={control}
                        required={required}
                        error={error}
                        type={type}
                        state={state}
                        label={label}
                    />
                </div>
            ) : null}
        </div>
    );
}





