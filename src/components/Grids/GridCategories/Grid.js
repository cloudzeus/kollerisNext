import React from 'react';
import { TreeGridComponent, ColumnsDirective, ColumnDirective, DetailRow, Inject } from '@syncfusion/ej2-react-treegrid';

const data = [
    {
        id: 1,
        label: 'Parent 1',
        children: [
            {
                id: 2,
                label: 'Child 1',
                height: 10,
                weight: 20,
                children: [
                    {
                        id: 3,
                        label: 'Grandchild 1',
                        length: 5,
                        depth: 3,
                        children2: []
                    },
                    {
                        id: 4,
                        label: 'Grandchild 2',
                        length: 7,
                        depth: 4,
                        children2: []
                    }
                ]
            },
            {
                id: 5,
                label: 'Child 2',
                height: 8,
                weight: 15,
                children: [
                    {
                        id: 6,
                        label: 'Grandchild 3',
                        length: 6,
                        depth: 2,
                        children2: []
                    }
                ]
            }
        ]
    },
    {
        id: 7,
        label: 'Parent 2',
        children: [
            {
                id: 8,
                label: 'Child 3',
                height: 12,
                weight: 25,
                children2: []
            }
        ]
    }
];

const TreeGrid = () => {

    const rowTemplate = (props) => {
        return (

            <div>
                <tr>
                    <td className="border" style={{ paddingLeft: '18px' }}>
                        <p>sefseffse</p>
                    </td>
                    <td className="border" style={{ padding: '10px 0px 0px 20px' }}>
                        <div style={{ fontSize: '14px' }}>
                        </div>
                    </td>
                   
                </tr>
            </div>
        )
    }
    return (
        <TreeGridComponent dataSource={data} childMapping='children' treeColumnIndex={0} rowTemplate={rowTemplate}>
            <ColumnsDirective>
                <ColumnDirective field="id" headerText="ID" width="90"></ColumnDirective>
                <ColumnDirective field="label" headerText="Label" width="150"></ColumnDirective>

            </ColumnsDirective>
            <Inject services={[DetailRow]} />
        </TreeGridComponent>
    );
};

export default TreeGrid;