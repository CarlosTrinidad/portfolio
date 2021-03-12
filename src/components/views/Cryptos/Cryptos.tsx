import {
  Button,
  Col,
  Dropdown,
  Menu,
  Modal,
  PageHeader,
  Row,
  Table,
  Tag,
  Typography,
} from "antd";
import create, { State } from "zustand";
import { dateSorter, numberSorter, stringSorter } from "../../../utils/sort";
import {
  notificationError,
  notificationWarning,
} from "../../common/Notification/notification";
import {
  toCurrency,
  toDecimal,
  toPrecise,
} from "../../../utils/formatable";

import DialogCryptoForm from "./DialogCryptoForm";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import FadeIn from "react-fade-in";
import React from "react";
import moment from "moment";
import { useCryptosActions } from "../../../hooks/useCryptos";
import useCurrencyExchange from "../../../hooks/useCurrencyExchange";
import useUser from "../../../hooks/useUser";

const { Title } = Typography;

interface CryptoForm {
  id: any;
  symbol: string;
  name: string;
  buyPrice: number;
  purchaseDate: any;
  amount: number;
}

interface SelectedStore extends State {
  clicked: any;
  setClicked: any;
}

const initialValueCryptoForm = {
  id: "",
  symbol: "",
  name: "",
  buyPrice: 0,
  purchaseDate: moment(),
  amount: 0,
};

const columns = [
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
    sorter: (a: any, b: any) => stringSorter(a.symbol, b.symbol),
    width: "120px",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a: any, b: any) => stringSorter(a.name, b.name),
    width: "190px",
  },
  {
    title: "Amount",
    dataIndex: "totalAmount",
    key: "totalAmount",
    sorter: (a: any, b: any) => numberSorter(a.totalAmount, b.totalAmount),
    render: (val: number) => toPrecise(val),
    width: "150px",
  },
  {
    title: "Avg. Buy Price",
    dataIndex: "averageBuyPrice",
    key: "averageBuyPrice",
    sorter: (a: any, b: any) =>
      numberSorter(a.averageBuyPrice, b.averageBuyPrice),
    render: (val: number) => toCurrency(val),
    width: "155px",
  },
  {
    title: "Market Price",
    dataIndex: "marketPrice",
    key: "marketPrice",
    sorter: (a: any, b: any) => numberSorter(a.marketPrice, b.marketPrice),
    render: (val: number) => toCurrency(val),
    width: "155px",
  },
  {
    title: "Cost Basis",
    dataIndex: "costBasis",
    key: "costBasis",
    sorter: (a: any, b: any) => numberSorter(a.costBasis, b.costBasis),
    render: (val: number) => toCurrency(val),
    width: "145px",
  },
  {
    title: "Market Value",
    key: "marketValue",
    dataIndex: "marketValue",
    sorter: (a: any, b: any) => numberSorter(a.marketValue, b.marketValue),
    render: (val: number) => toCurrency(val),
    width: "145px",
  },
  {
    title: "Gain/Loss",
    dataIndex: "gainLoss",
    key: "gainLoss",
    sorter: (a: any, b: any) => numberSorter(a.gainLoss, b.gainLoss),
    width: "130px",
    render: (val: number) => {
      let color = val <= 0 ? "volcano" : "green";
      return (
        <Tag color={color} key={val}>
          {toCurrency(val)}
        </Tag>
      );
    },
  },
  {
    title: "Growth",
    dataIndex: "growth",
    key: "growth",
    sorter: (a: any, b: any) => numberSorter(a.growth, b.growth),
    width: "130px",
    render: (val: number) => {
      let color = val <= 0 ? "volcano" : "green";
      return (
        <Tag color={color} key={val}>
          {toDecimal(val)}%
        </Tag>
      );
    },
  },
];

const useStore = create<SelectedStore>((set) => ({
  clicked: null,
  setClicked: (param: any) => set({ clicked: param }),
}));

const Variable: React.FC = () => {
  const user = useUser();
  const actions = useCryptosActions();
  const [data, setData] = React.useState<any>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [formValues, setFormValues] = React.useState<CryptoForm>(
    initialValueCryptoForm
  );

  const [groupBySymbol, setGroupBySymbol] = React.useState<any>({});
  const exchanger = useCurrencyExchange();

  const getData = React.useCallback(async () => {
    if (user === null) {
      return;
    }
    if (!user.uid) {
      return;
    }

    try {
      let result = await actions.get(user.uid);
      if (result !== undefined && !result.empty) {
        let agregated: any = {};

        result.forEach((result) => {
          let item = result.data();
          if (!agregated.hasOwnProperty(item.symbol)) {
            agregated[item.symbol] = {
              id: item.symbol,
              symbol: item.symbol,
              name: item.name,
              totalAmount: item.amount,
              totalPrice: item.amount * item.buyPrice,
              averageBuyPrice: 0,
              marketPrice: 0,
              costBasis: 0,
              marketValue: 0,
              gainLoss: 0,
              growth: 0,
              detail: [],
            };
          } else {
            agregated[item.symbol]["totalAmount"] += item.amount;
            agregated[item.symbol]["totalPrice"] += item.amount * item.buyPrice;
          }

          agregated[item.symbol]["detail"].push({
            id: result.id,
            name: item.name,
            buyPrice: item.buyPrice,
            assetClass: item.assetClass,
            symbol: item.symbol,
            amount: item.amount,
            purchaseDate: moment(item.purchaseDate.toDate()).format(
              "YYYY-MM-DD"
            ),
          });
        });
        setGroupBySymbol(agregated);
      }
    } catch (error) {
      setGroupBySymbol({});
      notificationError({
        message: "Error :(",
        description: error.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const cancelDialog = () => {
    setOpenDialog(false);
  };

  const confirmDialog = () => {
    setOpenDialog(false);
    getData();
  };

  const showDialog = () => {
    setOpenDialog(true);
    setFormValues(initialValueCryptoForm);
  };

  const updateItem = React.useCallback(
    (clicked) => {
      if (!clicked) {
        return;
      }
      setFormValues({
        id: clicked.id,
        symbol: clicked.symbol,
        name: clicked.name,
        amount: clicked.amount,
        buyPrice: clicked.buyPrice,
        purchaseDate: moment(clicked.purchaseDate, "YYYY-MM-DD"),
      });
      setOpenDialog(true);
    },
    [setFormValues, setOpenDialog]
  );

  const deleteItem = React.useCallback(
    (clicked) => {
      if (!clicked) {
        return;
      }
      Modal.confirm({
        title: "Are you sure you want to permanently delete this item?",
        icon: <ExclamationCircleOutlined />,
        content: "This action can not be undone..",
        onOk: async () => {
          try {
            await actions.destroy(clicked.id);
            notificationWarning({
              message: "Item deleted",
              description: "The item has been deleted",
            });
            getData();
          } catch (error) {
            notificationError({
              message: "Error :(",
              description: error.message,
            });
          }
        },
      });
    },
    [actions, getData]
  );

  React.useEffect(() => {
    let mounted = true;

    if (mounted) {
      getData();
    }

    return () => {
      mounted = false;
    };
  }, [getData]);

  React.useEffect(() => {
    let mounted = true;

    const currentRate = async () => {
      let result: Array<any> = [];

      for (const symbol in groupBySymbol) {
        if (groupBySymbol.hasOwnProperty(symbol)) {
          const element = groupBySymbol[symbol];
          let marketPrice = 0;

          let value = await exchanger({
            from: symbol.toUpperCase(),
            to: "MXN",
            q: "1",
          });

          if (value) {
            marketPrice = value ? value : 0;
          }

          let average = element.totalPrice / element.totalAmount;
          let costBasis = element.totalAmount * average;
          let marketValue = element.totalAmount * marketPrice;
          result.push({
            ...element,
            averageBuyPrice: average,
            marketPrice: marketPrice,
            costBasis: costBasis,
            marketValue: marketValue,
            gainLoss: marketValue - costBasis,
            growth: (marketValue / costBasis - 1) * 100,
          });
        }
      }

      return result;
    };

    if (mounted) {
      currentRate().then((result) => {
        setData(result);
      });
    }

    return () => {
      mounted = false;
    };
  }, [groupBySymbol, exchanger]);

  const DropdowRow: React.FC = (props) => {
    const { clicked } = useStore();
    return (
      <Dropdown
        arrow
        overlay={
          <Menu>
            <Menu.Item key="0" onClick={() => updateItem(clicked)}>
              Edit
            </Menu.Item>
            <Menu.Item key="1" onClick={() => deleteItem(clicked)} danger>
              Delete
            </Menu.Item>
          </Menu>
        }
        trigger={["contextMenu"]}
      >
        <tr {...props} />
      </Dropdown>
    );
  };

  const DetailTable = ({ record, setFormValues, setOpenDialog }: any) => {
    const { setClicked } = useStore();

    const columnsDetail = [
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        render: (val: number) => toPrecise(val),
        width: "50px",
        sorter: (a: any, b: any) => numberSorter(a.amount, b.amount),
      },
      {
        title: "Buy price",
        dataIndex: "buyPrice",
        key: "buyPrice",
        render: (val: number) => toCurrency(val),
        width: "50px",
        sorter: (a: any, b: any) => numberSorter(a.buyPrice, b.buyPrice),
      },
      {
        title: "Asset class",
        dataIndex: "assetClass",
        key: "assetClass",
        width: "50px",
        sorter: (a: any, b: any) => numberSorter(a.assetClass, b.assetClass),
      },
      {
        title: "Purchase date",
        dataIndex: "purchaseDate",
        key: "purchaseDate",
        width: "50px",
        sorter: (a: any, b: any) => dateSorter(a.purchaseDate, b.purchaseDate),
      },
    ];

    return (
      <PageHeader
        title={record.name}
      >
        <Table
          components={{
            body: {
              row: DropdowRow,
            },
          }}
          bordered
          rowKey="id"
          columns={columnsDetail}
          dataSource={record.detail}
          tableLayout="fixed"
          pagination={false}
          onRow={(current, rowIndex) => {
            return {
              onContextMenu: () => {
                setClicked(current);
              }, // right button click row
            };
          }}
        />
      </PageHeader>
    );
  };

  return (
    <FadeIn>
      <DialogCryptoForm
        visible={openDialog}
        handleCancel={cancelDialog}
        handleOk={confirmDialog}
        defaultValues={formValues}
      />
      <PageHeader
        className="site-page-header"
        title={
          <Title level={2} className="section-title">
            Cryptocurrencies
          </Title>
        }
        extra={[
          <Button
            key="1"
            type="primary"
            ghost
            size="large"
            onClick={showDialog}
          >
            Add crypto
          </Button>,
        ]}
      >
        <FadeIn>
          <Row justify="center" align="middle">
            <Col xs={24}>
              <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                pagination={false}
                tableLayout="fixed"
                scroll={{
                  x: "100vw",
                }}
                bordered
                summary={(pageData) => {
                  let totalGrowth = 0;
                  let totalGainLoss = 0;
                  let totalMarketValue = 0;
                  let totalCostBasis = 0;
                  let totalAmount = 0;

                  pageData.forEach((row) => {
                    totalAmount += row.totalAmount;
                    totalCostBasis += row.costBasis;
                    totalMarketValue += row.marketValue;
                    totalGainLoss += row.gainLoss;
                  });

                  if (!!(totalMarketValue / totalCostBasis)) {
                      totalGrowth += (totalMarketValue / totalCostBasis - 1) * 100;
                  }

                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={1}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>
                        {toPrecise(totalAmount)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={6}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={7}>
                        {toCurrency(totalCostBasis)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={8}>
                        {toCurrency(totalMarketValue)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={9}>
                        {
                          <Tag
                            color={totalGainLoss <= 0 ? "volcano" : "green"}
                            key={totalGainLoss}
                          >
                            {toCurrency(totalGainLoss)}
                          </Tag>
                        }
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={10}>
                        {
                          <Tag
                            color={totalGrowth <= 0 ? "volcano" : "green"}
                            key={totalGrowth}
                          >
                            {toDecimal(totalGrowth)}%
                          </Tag>
                        }
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  );
                }}
                expandable={{
                  expandedRowRender: (record) => (
                    <DetailTable
                      record={record}
                      setFormValues={setFormValues}
                      setOpenDialog={setOpenDialog}
                    />
                  ),
                  rowExpandable: (record) => !!record.symbol,
                }}
              />
            </Col>
          </Row>
        </FadeIn>
      </PageHeader>
    </FadeIn>
  );
};

export default Variable;
