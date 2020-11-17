import { DonutChart, registerTheme, useTheme } from "bizcharts";

import React from "react";
import useAssetsContext from "../../../store/assets";

registerTheme("asset", {
  defaultColor: "#003f5c",
  colors10: [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "#ffa600",
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

const selector = (state: any) => state.original;

const AssetClassPie: React.FC = () => {
  const original = useAssetsContext(selector);
  const [theme] = useTheme("asset");

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;

    if (mounted) {
      let formated: any = [];

      for (let index = 0; index < original.length; index++) {
        const element = original[index];
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
  }, [original]);
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
