import { DonutChart, registerTheme, useTheme } from "bizcharts";

import React from "react";

registerTheme("default", {
  defaultColor: "#f29e4c",
  colors: [
    "#f29e4c",
    "#54478c",
    "#2c699a",
    "#048ba8",
    "#0db39e",
    "#16db93",
    "#83e377",
    "#b9e769",
    "#efea5a",
    "#f1c453",
    "#606c38",
    "#ffc6ff",
    "#a0c4ff",
    "#f77f00",
    "#a77f00",
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

const DetailPie = ({ data }: any) => {
  const [theme] = useTheme("default");
  
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
        type: "outer",
        visible: true,
        style: {
          lineWidth: 1,
          stroke: "#676767",
          fill: "#fff",
          fontWeight: 800,
        },
        formatter: (text, item) => {
          let textShort =
            item._origin.type.length <= 7
              ? item._origin.type
              : item._origin.type.substring(0, 5) + "...";

          return `${textShort} - ${text}`;
        }
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
