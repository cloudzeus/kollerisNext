
import React, { useEffect, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import deepLtranslator from "@/utils/deepL";
import styled from "styled-components";
import Flag from 'react-world-flags'
import axios from "axios";
import { LoadingIndicator } from "@syncfusion/ej2-react-treegrid";


export default function TranslateField({ value, translations, url, id, fieldName, index}) {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState(translations)
    const [loading, setLoading] = useState(false)

    const onsubmit = async () => {
        console.log(data)
        let _newData = [
            {
                fiendName: fieldName,
                translations: data
            }
        ]
        let res = await axios.post(url, { action: 'translate', data:data, id: id, index: index, fieldName: fieldName})
        console.log('res data')
        console.log(res.data)
    }

    const onRowEditComplete = (e) => {
        let _data = [...data];
        let { newData, index } = e;
        console.log('newData: ' + JSON.stringify(newData))
        _data[0].translations[index] = newData;
        setData(_data);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const CountryIcon = (props) => {
        return (
            <div className="flex align-items-center justify-content-start">
                <Flag code={props.code} style={{ width: '20px', height: '15px' }} />
                <span className="ml-2">{props.locale}</span>
            </div>
        )
    }
    const deleteRow = (rowData) => {
        return (
            <DeleteLang rowData={rowData} />
        )
    }

    const DeleteLang = (rowData) => {
        const onClick = () => {
            let _data = [...data];
            console.log(_data)
            let _translations = _data.filter(item=> item.code !== rowData.rowData.code);
            _data = _translations;
            console.log(_data)
            setData(_data);
        }
        return (
            <i onClick={onClick} className="pi pi-trash icon"></i>
        )
    }

    const header = (
        <div className="flex flex-column  align-items-start justify-content-between gap-1 border-bottom-1 border-300 ">
            <span className="text-900 text-sm font-medium">Πεδίο προς μετάφραση:</span>
            <p className="text-500 text-md font-medium mb-4">{value}</p>
        </div>
    );


  

    const autoTranslate = (rowData) => {
        
        const handleTranslation = async () => {
            setLoading(true)
            let resp = await axios.post('/api/deepL', { text: value, targetLang: rowData.code })
            const _data = [...data];
            const index = _data.findIndex(translation => translation.code === rowData.code);
            _data[index].translation = resp.data.translatedText;
            setData(_data);
            setLoading(false)

        }
        return (
            <Button label="auto-tr" loading={loading} onClick={handleTranslation}/>
        )
    }
    return (
        <div >
            <GridField onClick={() => setVisible(true)} >
                <i className="pi pi-language icon"></i>
                <span className="value">{value}</span>
            </GridField>
            <Dialog header={header}  visible={visible} style={{ width: '70vw' }} onHide={() => setVisible(false)}>
                <DataTable
                    showGridlines
                    value={data}
                    editMode="row"
                    dataKey="code"
                    onRowEditComplete={onRowEditComplete}
                >
                    <Column field="locale" style={{ width: '200px' }} header="Γλώσσα" body={CountryIcon}></Column>
                    <Column field="translation" header="Μετάφραση" editor={(options) => textEditor(options)} ></Column>
                    <Column rowEditor style={{ width: '100px' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    <Column style={{ width: '30px' }} body={deleteRow} bodyStyle={{ textAlign: 'center' }}></Column>
                    <Column style={{ width: '200px' }} body={autoTranslate} bodyStyle={{ textAlign: 'center' }}></Column>

                </DataTable>
                <p className="mt-4 mb-2">Προσθήκη Γλώσσας</p>
                <div className="flex align-items-start">
                    <SelectLanguage state={data} setState={setData} />
                </div>
                <div className="border-top-1 border-300  mt-4">
                    <Button label="Αποθήκευση" onClick={onsubmit} className="mt-4" />
                </div>
            </Dialog>
        </div>
    )
}







function SelectLanguage({ state, setState }) {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const countries = [
        { locale: 'Aγγλικά', code: 'GB' },
        { locale: 'Γαλλικά', code: 'FR' },
        { locale: 'Γερμανικά', code: 'DE' },
        { locale: 'Ισπανικά', code: 'ES' },
        { locale: 'Ιταλικά', code: 'IT' },

    ];


    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-start">
                    <Flag code={option.code} style={{ width: '40px', height: '15px' }} />
                    <div>{option.locale}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const countryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <Flag code={option.code} style={{ width: '40px', height: '15px' }} />
                <div>{option.locale}</div>
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



    const onSelect = (e) => {
        let value = e.value;
        if(typeof state === 'undefined') {
            setState([
                {
                    locale: value.locale,
                    code: value.code,
                    translation: ''
                }
            ])
            return;
        }
        let _state = [...state];
        
       
        console.log('e.value: ' + JSON.stringify(e.value))
        if (_state.find(translation => translation.code === value.code)) {
            return;
        }
        _state.push({
            locale: value.locale,
            code: value.code,
            translation: ''
        });
        setState(_state);
        setSelectedCountry(e.value)

    }

    return (
        <div className="card flex justify-content-center">
            <Dropdown
                value={selectedCountry}
                onChange={onSelect}
                options={countries}
                optionLabel="locale"
                placeholder="Select a Country"
                valueTemplate={selectedCountryTemplate}
                itemTemplate={countryOptionTemplate}
                className="w-full md:w-14rem"
                panelFooterTemplate={panelFooterTemplate} />
        </div>
    )
}


const GridField = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;


    .icon {
        margin-right: 0.5rem;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        background-color: #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon i {
        font-size: 12px;
    }
`