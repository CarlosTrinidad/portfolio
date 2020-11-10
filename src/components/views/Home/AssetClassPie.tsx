import { DonutChart } from "bizcharts";
import React from "react";

const AssetClassPie: React.FC = () => {
  const data = [
    {
      type: "US Equities",
      value: 33,
    },
    {
      type: "Money Market",
      value: 23.2,
    },
    {
      type: "Real Estate Funds",
      value: 13,
    },
    {
      type: "Developing World International Equities",
      value: 12.2,
    },
    {
      type: "Goverment Bonds",
      value: 9.8,
    },
    {
      type: "Emerging Market Equities",
      value: 8.9,
    },
  ];

  return (
    <DonutChart
      data={data || []}
      forceFit
      statistic={{
        visible: false,
      }}
      angleField="value"
      colorField="type"
      legend={{
        position: "bottom-center",
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

export default AssetClassPie;
