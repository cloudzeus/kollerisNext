import React from 'react'
import AdminLayout from 'src/layouts/Admin/AdminLayout'
import styled from 'styled-components';
import { Category, ChartComponent, ColumnSeries, DataLabel, Inject, Legend, LineSeries, SeriesCollectionDirective, SeriesDirective, Tooltip } from '@syncfusion/ej2-react-charts';


const tooltip = { enable: true, shared: false };
const primaryyAxis = { labelFormat: '${value}K' };
const primarxyAxis = { valueType: 'Category' };
const legendSettings = { visible: true };
const marker = { dataLabel: { visible: true } };

const Chart = () => {
  const data = [
    { month: 'Jan', sales: 35 }, { month: 'Feb', sales: 28 },
    { month: 'Mar', sales: 34 }, { month: 'Apr', sales: 32 },
    { month: 'May', sales: 40 }, { month: 'Jun', sales: 32 },
    { month: 'Jul', sales: 35 }, { month: 'Aug', sales: 55 },
    { month: 'Sep', sales: 38 }, { month: 'Oct', sales: 30 },
    { month: 'Nov', sales: 25 }, { month: 'Dec', sales: 32 }
  ];


  return (
    <AdminLayout>
      <Container>
        <ChartComponent id="charts" primaryXAxis={primarxyAxis} legendSettings={legendSettings} primaryYAxis={primaryyAxis} tooltip={tooltip}>
          <Inject services={[ColumnSeries, DataLabel, Tooltip, Legend, LineSeries, Category]} />
          <SeriesCollectionDirective>
            <SeriesDirective dataSource={data} xName='month' yName='sales' name='Sales' marker={marker} />
          </SeriesCollectionDirective>
        </ChartComponent>
      </Container>
     
    </AdminLayout>
  )
}

const Container = styled.div`
  background-color: white;
  padding: 20px; 
  border-radius: 5px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  width: '100%';
`


export default Chart


