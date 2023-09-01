import React, { useState } from 'react'

import { Button } from 'primereact/button';
import styled from 'styled-components';
import TreeSelectComp from './TreeSelectComp';

const MenuOptions = ({ setId, setClickMenu }) => {
    const onClick = (id) => {
        setClickMenu(false)
        setId(id)
        console.log(id)
    }

    return (
        <MenuDiv>
            <ul>
                <li onClick={() => onClick(1)}>Αλλαγή κατηγοριοποίησης</li>
                <div className='line'></div>
                <li onClick={() => onClick(2)}>Αλλαγή Impa</li>
            </ul>
        </MenuDiv>
    )
}


const ToolbarActions = ({gridData}) => {
    const [clickMenu, setClickMenu] = useState(false)
    const [id, setId] = useState(null);
    return (
        <div className="card">
            <div className='mb-2 mt-2'>
                <Button label="Μenu" icon="pi pi-bars" className="surface-ground text-primary w-full p-mr-2 mt-3" onClick={() => setClickMenu((prev) => !prev)} />
                {clickMenu ?
                    (
                        <MenuOptions setId={setId} setClickMenu={setClickMenu} />
                    )
                    : null}
            </div>
            <div>
                {id === 1 && !clickMenu ? (<TreeSelectComp gridData={gridData} />) : null}
                {id ===2 && !clickMenu  ? (<p>test 2</p>) : null}
                {id ===3 && !clickMenu  ? (<p>test 3</p>) : null}
            </div>
        </div>

    )
}





const MenuDiv = styled.div`
    margin-top: 5px;
    /* display: inline-flex; */
    border: 1px solid #cacaca;
    border-radius: 5px;
    
    li {
        list-style: none;
        cursor: pointer;
        display: block;
        padding: 10px;
    }

    .line {
        width: 100%;
        height: 1px;
        background-color: #cacaca;
    }
    
`

export default ToolbarActions