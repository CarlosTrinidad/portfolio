import { DonutChart, registerTheme, useTheme } from "bizcharts";

import React from "react";

registerTheme("default", {
  defaultColor: "#505000",
  colors10: [
    "#54478c",
    "#2c699a",
    "#048ba8",
    "#0db39e",
    "#16db93",
    "#83e377",
    "#b9e769",
    "#efea5a",
    "#f1c453",
    "#f29e4c",
  ],
  geometries: {
    interval: {
      rect: {
        default: {
          style: { fill: "#6DC8EC", stroke: "red", fillOpacity: 0.95 },
        },
        active: { style: { stroke: "#5AD8A6", lineWidth: 1 } },
        inactive: { style: { fillOpacity: 0.3, strokeOpacity: 0.3 } },
        selected: {},
      },
    },
  },
});

const DetailPie: React.FC = () => {
  const [theme] = useTheme("default");

  const data = [
    {
      type: "US Equities",
      value: 10,
      amount: 100,
    },
    {
      type: "Money Market",
      value: 10,
      amount: 100,
    },
    {
      type: "Real Estate Funds",
      value: 10,
      amount: 100,
    },
    {
      type: "Developing World International Equities",
      value: 10,
      amount: 100,
    },
    {
      type: "Goverment Bonds",
      value: 10,
      amount: 100,
    },
    {
      type: "Emerging Market Equities",
      value: 10,
      amount: 100,
    },
    {
      type: "1US Equities",
      value: 10,
      amount: 100,
    },
    {
      type: "1Money Market",
      value: 10,
      amount: 100,
    },
    {
      type: "1Real Estate Funds",
      value: 10,
      amount: 100,
    },
    {
      type: "1Developing World International Equities",
      value: 10,
      amount: 100,
    },
  ];

  return (
    <DonutChart
      theme={theme}
      data={data || []}
      forceFit
      statistic={{
        visible: false,
      }}
      angleField="value"
      colorField="type"
      legend={{
        position: "bottom-center",
        text: {
          formatter: (text: string, config: any) => {
            return text;
          },
        },
      }}
      label={{
        visible: true,
        style: {
          lineWidth: 1,
          stroke: "#676767",
          fill: "#fff",
          fontWeight: 800,
        },
      }}
      meta={{
        value: {
          formatter: (val: any) => {
            val = `${val.toFixed(2)}%`;
            return val;
          },
        },
      }}
      tooltip={{
        visible: true,
      }}
      interactions={[
        {
          type: "element-highlight",
        },
      ]}
    />
  );
};

export default DetailPie;
