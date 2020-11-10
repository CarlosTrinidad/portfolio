import { DonutChart } from "bizcharts";
import React from "react";

const GeneralPie: React.FC = () => {
  const data = [
    {
      type: "Fixed",
      value: 23,
    },
    {
      type: "Variable",
      value: 77,
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

export default GeneralPie;
