import { DonutChart } from "bizcharts";
import React from "react";
import useAssetsContext from "../../../store/assets";

const CalculatorPie: React.FC = () => {
  const { custom } = useAssetsContext();

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
