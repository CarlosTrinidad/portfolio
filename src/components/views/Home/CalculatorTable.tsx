import { Controller, useForm } from "react-hook-form";
import { Input, Table, Typography } from "antd";
import { numberSorter, stringSorter } from "../../../utils/sort";
import { toCurrency, toDecimal } from "../../../utils/formatable";

import Item from "antd/lib/list/Item";
import React from "react";
import useAssetsContext from "../../../store/assets";

const { Text } = Typography;

const columns = [
  {
    title: "Asset class",
    dataIndex: "assetClass",
    key: "assetClass",
    sorter: (a: any, b: any) => stringSorter(a.assetClass, b.assetClass),
    width: "160px",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    sorter: (a: any, b: any) => numberSorter(a.amount, b.amount),
    render: (val: number) => toCurrency(val),

    width: "160px",
  },
  {
    title: "Weights",
    dataIndex: "weights",
    key: "weights",
    sorter: (a: any, b: any) => numberSorter(a.weights, b.weights),
    render: (val: number) => toDecimal(val) + "%",
    width: "160px",
    editable: true,
  },
  {
    title: "Gain/Loss",
    dataIndex: "gainLoss",
    key: "gainLoss",
    sorter: (a: any, b: any) => numberSorter(a.gainLoss, b.gainLoss),
    render: (val: number) => {
      if (val < 0) {
        return <Text type="danger">{toCurrency(val)}</Text>;
      }
      if (val > 0) {
        return <Text type="success">{toCurrency(val)}</Text>;
      }
      if (val === 0) {
        return <Text>{toCurrency(val)}</Text>;
      }
    },
    width: "160px",
  },
];

interface Item {
  id: number;
  assetClass: string;
  amount: number;
  weights: number;
  gainLoss: number;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: Item;
}

interface RowFields {
  weights: number;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  ...restProps
}) => {
  const { setCustom, original, custom } = useAssetsContext();
  const [total, setTotal] = React.useState(0);
  const [editing, setEditing] = React.useState(false);
  const { control, reset } = useForm<RowFields>({
    defaultValues: {
      weights: !!record ? record.weights : 0,
    },
  });

  React.useEffect(() => {
    let mounted = true;
    if (mounted && record?.weights !== undefined) {
      reset(record);
    }

    return () => {
      mounted = false;
    };
  }, [record, reset]);

  React.useEffect(() => {
    let mounted = true;
    if (mounted) {
      let total = original.reduce((prev, current) => prev + current.amount, 0);
      setTotal(total);
    }

    return () => {
      mounted = false;
    };
  }, [original]);

  const toggleEdit = React.useCallback(() => {
    setEditing(!editing);
  }, [editing]);

  const save = React.useCallback(
    (e: any, record: Item) => {
      let newCustom: Item[] = [];
      let newWeight = Number(e.target.value) ?? 0;

      for (let index = 0; index < custom.length; index++) {
        let element = custom[index];

        let newAmount = 0;

        if (element.id === record.id) {
          element.weights = newWeight;
          newAmount = total * (newWeight / 100);
          element.amount = newAmount;
          element.gainLoss = newAmount - original[index].amount;
        }

        newCustom.push(element);
      }

      setCustom(newCustom);
      toggleEdit();
    },
    [custom, original, setCustom, toggleEdit, total]
  );

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Controller
        name="weights"
        control={control}
        render={(props: any) => (
          <Input
            {...props}
            type="number"
            onBlur={(e) => save(e, record)}
            autoFocus
          />
        )}
      />
    ) : (
      <div
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const CalculatorTable: React.FC = () => {
  const { custom } = useAssetsContext();

  const cols = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });

  return (
    <Table
      rowKey="id"
      columns={cols}
      dataSource={custom}
      pagination={false}
      tableLayout="auto"
      components={{
        body: {
          cell: EditableCell,
        },
      }}
      bordered
      summary={(pageData) => {
        let totalAmount = 0;
        let totalWeigth = 0;
        let totalGainLoss = 0;

        pageData.forEach((item) => {
          totalAmount += item.amount;
          totalWeigth += item.weights;
          totalGainLoss += item.gainLoss;
        });

        return (
          <Table.Summary.Row>
            <Table.Summary.Cell index={1}>-</Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              {toCurrency(totalAmount)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3}>
              {toDecimal(totalWeigth)}%
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4}>
              {totalGainLoss < 0 && (
                <Text type="danger">{toCurrency(totalGainLoss)}</Text>
              )}
              {totalGainLoss > 0 && (
                <Text type="success">{toCurrency(totalGainLoss)}</Text>
              )}
              {totalGainLoss === 0 && <Text>{toCurrency(totalGainLoss)}</Text>}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        );
      }}
    />
  );
};

export default CalculatorTable;
