/**
 * Sample for column series with rounded corner
 */

import * as React from "react";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Category, ColumnSeries, DataLabel, Tooltip } from '@syncfusion/ej2-react-charts';
import { Browser } from '@syncfusion/ej2-base';
import styled from "styled-components";
const SAMPLE_CSS = `
     .control-fluid {
         padding: 0px !important;
     }`;


export let data1 = [
    { x: 'Niger', y: 19.1, Rate: 100, text: "19.1%" },
    { x: 'Sierra Leone', y: 48.1, Rate: 100, text: "48.1%" },
    { x: 'South Sudan', y: 26.8, Rate: 100, text: "26.8%" },
    { x: 'Nepal', y: 64.7, Rate: 100, text: "64.7%" },
    { x: 'Gambia', y: 55.5, Rate: 100, text: "55.5%" },
    { x: 'Gyana', y: 88.5, Rate: 100, text: "88.5%" },
    { x: 'Kenya', y: 78.0, Rate: 100, text: "78.0%" },
    { x: 'Singapore', y: 96.8, Rate: 100, text: "96.8%" }
];
export let pointRender = (args) => {
    let selectedTheme = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'material';
    if (selectedTheme && selectedTheme.indexOf('fabric-dark') > -1) {
        if (args.series.yName == "Rate")
            args.fill = "f9fafb";
    }
    else if (selectedTheme && selectedTheme.indexOf('fabric') > -1) {
        if (args.series.yName == "Rate")
            args.fill = "grey";
    }
    else if (selectedTheme === 'material-dark') {
        if (args.series.yName == "Rate")
            args.fill = "f9fafb";
    }
    else if (selectedTheme === 'material') {
        if (args.series.yName == "Rate")
            args.fill = "grey";
    }
    else if (selectedTheme === 'bootstrap5-dark') {
        if (args.series.yName == "Rate")
            args.fill = "#f9fafb";
    }
    else if (selectedTheme === 'bootstrap5') {
        if (args.series.yName == "Rate")
            args.fill = "grey";
    }
    else if (selectedTheme === 'bootstrap-dark') {
        if (args.series.yName == "Rate")
            args.fill = "f9fafb";
    }
    else if (selectedTheme === 'bootstrap') {
        if (args.series.yName == "Rate")
            args.fill = "grey";
    }
    else if (selectedTheme === 'highcontrast') {
        if (args.series.yName == "Rate")
            args.fill = "#f9fafb";
    }
    else if (selectedTheme === 'fluent-dark') {
        if (args.series.yName == "Rate")
            args.fill = "#f9fafb";
    }
    else if (selectedTheme === 'fluent') {
        if (args.series.yName == "Rate")
            args.fill = "grey";
    }
    else if (selectedTheme === 'tailwind-dark') {
        if (args.series.yName == "Rate")
            args.fill = "#f9fafb";
    }
    else if (selectedTheme === 'tailwind') {
        if (args.series.yName == "Rate")
            args.fill = "grey";
    }
    else {
        if (args.series.yName == "Rate")
            args.fill = "grey";
    }
};
let count = 0;
function RoundedColumn() {
    function load(args) {
        let selectedTheme = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.chart.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
    }
    ;
    function loaded(args) {
        let chart = document.getElementById('charts2');
        chart.setAttribute('title', '');
    }
    ;
    return (
        <AdminLayout>
            <GridLayout>
                <Container className="box">
                       <style>
                {SAMPLE_CSS}
            </style>
                    <div className='control-section'>
                        <ChartComponent id='charts2' style={{ textAlign: "center" }} enableSideBySidePlacement={false} primaryXAxis={{
                            valueType: 'Category', interval: 1, majorGridLines: { width: 0 },
                            majorTickLines: { width: 0 },
                            minorTickLines: { width: 0 }, labelPosition: 'Outside', labelRotation: Browser.isDevice ? -45 : 0, labelIntersectAction: Browser.isDevice ? 'None' : 'Rotate45',
                        }} primaryYAxis={{ minimum: 0, maximum: 100, title: 'Literacy Rate In Percentage', labelFormat: '{value}%', interval: 25, majorTickLines: { width: 0 }, lineStyle: { width: 0 } }} chartArea={{ border: { width: 0 } }} load={load.bind(this)} title='Literacy rate by Country in 2015' loaded={loaded.bind(this)} legendSettings={{ visible: false }} width={Browser.isDevice ? '100%' : '77%'} tooltip={{ enable: true, header: "<b>${point.x}</b>", format: "Rate : <b>${point.text}</b>" }} pointRender={pointRender}>
                            <Inject services={[ColumnSeries, DataLabel, Category, Tooltip]} />
                            <SeriesCollectionDirective>
                                <SeriesDirective xName='x' yName='Rate' enableTooltip={false} columnWidth={0.8} opacity={0.5} dataSource={data1} type='Column' name='Tiger' cornerRadius={{ bottomLeft: Browser.isDevice ? 12 : 35, bottomRight: Browser.isDevice ? 12 : 35, topLeft: Browser.isDevice ? 12 : 35, topRight: Browser.isDevice ? 12 : 35 }}>
                                </SeriesDirective>
                                <SeriesDirective xName='x' yName='y' columnWidth={0.8} dataSource={data1} type='Column' marker={{ dataLabel: { visible: true, name: 'text', enableRotation: Browser.isDevice ? true : false, angle: -90, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }} name='Tiger' cornerRadius={{ bottomLeft: Browser.isDevice ? 12 : 35, bottomRight: Browser.isDevice ? 12 : 35, topLeft: Browser.isDevice ? 12 : 35, topRight: Browser.isDevice ? 12 : 35 }}>
                                </SeriesDirective>
                            </SeriesCollectionDirective>
                        </ChartComponent>
                    </div>
                </Container >
                <Container className="box">
           
                    <div className='control-section'>
                        <ChartComponent id='charts3' style={{ textAlign: "center" }} enableSideBySidePlacement={false} primaryXAxis={{
                            valueType: 'Category', interval: 1, majorGridLines: { width: 0 },
                            majorTickLines: { width: 0 },
                            minorTickLines: { width: 0 }, labelPosition: 'Outside', labelRotation: Browser.isDevice ? -45 : 0, labelIntersectAction: Browser.isDevice ? 'None' : 'Rotate45',
                        }} primaryYAxis={{ minimum: 0, maximum: 100, title: 'Literacy Rate In Percentage', labelFormat: '{value}%', interval: 25, majorTickLines: { width: 0 }, lineStyle: { width: 0 } }} chartArea={{ border: { width: 0 } }} load={load.bind(this)} title='Literacy rate by Country in 2015' loaded={loaded.bind(this)} legendSettings={{ visible: false }} width={Browser.isDevice ? '100%' : '77%'} tooltip={{ enable: true, header: "<b>${point.x}</b>", format: "Rate : <b>${point.text}</b>" }} pointRender={pointRender}>
                            <Inject services={[ColumnSeries, DataLabel, Category, Tooltip]} />
                            <SeriesCollectionDirective>
                                <SeriesDirective xName='x' yName='Rate' enableTooltip={false} columnWidth={0.8} opacity={0.5} dataSource={data1} type='Column' name='Tiger' cornerRadius={{ bottomLeft: Browser.isDevice ? 12 : 35, bottomRight: Browser.isDevice ? 12 : 35, topLeft: Browser.isDevice ? 12 : 35, topRight: Browser.isDevice ? 12 : 35 }}>
                                </SeriesDirective>
                                <SeriesDirective xName='x' yName='y' columnWidth={0.8} dataSource={data1} type='Column' marker={{ dataLabel: { visible: true, name: 'text', enableRotation: Browser.isDevice ? true : false, angle: -90, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } }} name='Tiger' cornerRadius={{ bottomLeft: Browser.isDevice ? 12 : 35, bottomRight: Browser.isDevice ? 12 : 35, topLeft: Browser.isDevice ? 12 : 35, topRight: Browser.isDevice ? 12 : 35 }}>
                                </SeriesDirective>
                            </SeriesCollectionDirective>
                        </ChartComponent>
                    </div>
                </Container >
            </GridLayout>
        </AdminLayout>
    )




}

const Container = styled.div`
  
`

const GridLayout = styled.div`
    display: grid;
    grid-template-columns: 60% 1fr;
    grid-gap: 10px;
`
export default RoundedColumn;