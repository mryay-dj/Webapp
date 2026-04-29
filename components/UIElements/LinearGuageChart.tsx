// LinearGaugeChart.tsx
import React from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

interface LinearGaugeChartProps {
  data: Array<{ value: number }>;
}

const LinearGaugeChart: React.FC<LinearGaugeChartProps> = ({ data }) => {
  const chartConfigs = {
    type: 'hlineargauge',
    width: '100%',
    height: '300',
    dataFormat: 'json',
    dataSource: {
      chart: {
        theme: 'fusion',
        showValue: 1,
      },
      colorrange: {
        color: [
          {
            minvalue: 0,
            maxvalue: 50,
            code: '#F2726F',
          },
          {
            minvalue: 50,
            maxvalue: 75,
            code: '#FFC533',
          },
          {
            minvalue: 75,
            maxvalue: 100,
            code: '#62B58F',
          },
        ],
      },
      dials: {
        dial: data.map((item, index) => ({
          value: item.value,
          rearExtension: 15,
          // Customize dial properties as needed
        })),
      },
    },
  };

  const FC = ReactFC as any;

  return <FC {...chartConfigs} />;
};

export default LinearGaugeChart;
