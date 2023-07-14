
import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';


import styled from "styled-components";
import Flag from 'react-world-flags'


export default function TranslateField({ fieldName, value, handleApi, data, setData }) {
    const [visible, setVisible] = useState(false);
 

    console.log('data: ' + JSON.stringify(data))

    const onsubmit = () => {
        console.log('data to be submitted')
        console.log(data)
        handleApi && handleApi(data)
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
            <div className="flex align-content-center justify-content-start">
                <Flag code={props.code} style={{ width: '40px', height: '15px' }} />
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
            let _translations = _data[0].translations.filter(translation => translation.code !== rowData.rowData.code);
            _data[0].translations = _translations;
            setData(_data);
        }
        return (
            <i onClick={onClick} className="pi pi-trash icon"></i>
        )
    }
    return (
        <div >
            <GridField onClick={() => setVisible(true)} >
                <i className="pi pi-language icon"></i>
                <span className="value">{value}</span>
            </GridField>
            <Dialog header={value} visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <DataTable
                    showGridlines
                    value={data[0].translations}
                    editMode="row"
                    dataKey="code"
                    onRowEditComplete={onRowEditComplete}
                >
                    <Column field="locale" header="Γλώσσα" body={CountryIcon}></Column>
                    <Column field="translation" header="Μετάφραση" editor={(options) => textEditor(options)} ></Column>
                    <Column rowEditor style={{ width: '100px' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    <Column style={{ width: '30px' }} body={deleteRow} bodyStyle={{ textAlign: 'center' }}></Column>

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
        { locale: 'Ισπανίκά', code: 'ES' },
        { locale: 'Βραζιλιάνικα', code: 'BR' },
        { locale: 'Κινέζικα', code: 'CN' },
        { locale: 'Ιαπωνικά', code: 'JP' },

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
        let _state = [...state];
        let value = e.value;
        console.log('e.value: ' + JSON.stringify(e.value))
        if (_state[0].translations.find(translation => translation.code === value.code)) {
            return;
        }
        _state[0].translations.push({
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