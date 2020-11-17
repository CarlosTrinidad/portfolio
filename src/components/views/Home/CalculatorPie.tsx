import { DonutChart, registerTheme, useTheme } from "bizcharts";

import React from "react";
import useAssetsContext from "../../../store/assets";
const selectorCustom = (state: any) => state.custom;


registerTheme("calculator", {
  defaultColor: "#ff4b5c",
  colors10: [
    "#ff4b5c",
    "#056674",
    "#66bfbf",
    "#e0ece4",
    "#364f6b",
    "#3fc1c9",
    "#f38181",
    "#fce38a",
    "#aaaaaa",
    "#f2dcbb",
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


const CalculatorPie: React.FC = () => {
  const custom = useAssetsContext(selectorCustom);
  const [theme] = useTheme("calculator");

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;

    if (mounted) {
      let formated: any = [];

      for (let index = 0; index < custom.length; index++) {
        const element = custom[index];
        if (element.weights > 0) {
          formated.push({
            type: element.assetClass,
            value: element.weights,
          });
        }
      }

      setData(formated);
    }
    return () => {
      mounted = false;
    };
  }, [custom]);

  return (
    <DonutChart
      theme={theme}
      data={data}
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

export default CalculatorPie;
