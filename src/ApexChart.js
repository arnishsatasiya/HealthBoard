import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = (props) => {
  const [series, setSeries] = useState([]);
  const options = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      colors: '#df4142',
      curve: 'smooth',
    },
    title: {
      text: props.metricName, // Set the title to "Scans"
      align: 'left',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function (val) {
          return new Date(val).toLocaleDateString();
        },
      },
    },
    yaxis: {
      title: {
        text: 'Value',
      },
    },
  };

  // Define the generateChartData function outside the useEffect
  const generateChartData = (metricData) => {
    const newSeries = [
      {
        color: '#df4142',
        name: props.metricName, // Set the series name to "Scans"
        data: Object.entries(metricData).map(([date, value]) => ({
          x: new Date(date).getTime(),
          y: value,
        })),
      },
    ];

    setSeries(newSeries);
  };

  // Use useEffect to call the generateChartData function when trends or metricName changes
  useEffect(() => {
    console.log("Metric Data:", props.trends);
    generateChartData(props.trends);
  }, [props.trends, props.metricName]);

  return (
    <div className="chart">
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default ApexChart;