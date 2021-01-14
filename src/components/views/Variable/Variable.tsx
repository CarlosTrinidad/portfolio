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
import { ExclamationCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import create, { State } from "zustand";
import {
  notificationError,
  notificationWarning,
} from "../../common/Notification/notification";
import { numberSorter, stringSorter } from "../../../utils/sort";
import { toCurrency, toDecimal, toInteger } from "../../../utils/formatable";

import DialogShareForm from "./DialogShareForm";
import FadeIn from "react-fade-in";
import React from "react";
import moment from "moment";
import useMarketQuotes from "../../../hooks/useMarketQuotes";
import useUser from "../../../hooks/useUser";
import { useVariableActions } from "../../../hooks/useVariable";

const { Title, Text } = Typography;

interface ShareForm {
  id: any;
  symbol: string;
  companyName: string;
  description: string;
  shares: number;
  buyPrice: number;
  assetClass: null | string;
  purchaseDate: any;
}
interface SelectedStore extends State {
  clicked: any;
  setClicked: any;
}

const initialValueShareForm = {
  id: "",
  symbol: "",
  companyName: "",
  description: "",
  shares: 0,
  buyPrice: 0,
  assetClass: null,
  purchaseDate: moment(),
};

const columns = [
  {
    title: "Company name",
    dataIndex: "companyName",
    key: "companyName",
    sorter: (a: any, b: any) => stringSorter(a.companyName, b.companyName),
    width: "225px",
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
    sorter: (a: any, b: any) => stringSorter(a.symbol, b.symbol),
    width: "120px",
  },
  {
    title: "Shares",
    dataIndex: "totalShares",
    key: "totalShares",
    sorter: (a: any, b: any) => numberSorter(a.totalShares, b.totalShares),
    render: (val: number) => toInteger(val),
    width: "110px",
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
  {
    title: "Annual Dividend",
    dataIndex: "anualDividend",
    key: "anualDividend",
    sorter: (a: any, b: any) => numberSorter(a.anualDividend, b.anualDividend),
    render: (val: number) => toCurrency(val),
    width: "170px",
  },
  {
    title: "Dividend Yield",
    dataIndex: "dividendYield",
    key: "dividendYield",
    sorter: (a: any, b: any) => numberSorter(a.dividendYield, b.dividendYield),
    render: (val: number) => toDecimal(val) + "%",
    width: "155px",
  },

  {
    title: "Anual Income",
    dataIndex: "anualIncome",
    key: "anualIncome",
    sorter: (a: any, b: any) => numberSorter(a.anualIncome, b.anualIncome),
    render: (val: number) => toCurrency(val),
    width: "160px",
  },
];

const useStore = create<SelectedStore>((set) => ({
  clicked: null,
  setClicked: (param: any) => set({ clicked: param }),
}));

const Variable: React.FC = () => {
  const user = useUser();
  const actions = useVariableActions();
  const [groupBySymbol, setGroupBySymbol] = React.useState<any>({});
  const [data, setData] = React.useState<any>([]);
  const [quotesList, setQuotesList] = React.useState<Array<string>>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [formValues, setFormValues] = React.useState<ShareForm>(
    initialValueShareForm
  );
  const [quoteInfo, setQuotes] = useMarketQuotes();

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
              companyName: item.companyName,
              symbol: item.symbol,
              totalShares: item.shares,
              totalPrice: item.shares * item.buyPrice,
              averageBuyPrice: 0,
              marketPrice: 0,
              costBasis: 0,
              marketValue: 0,
              gainLoss: 0,
              growth: 0,
              anualDividend: 0,
              dividendYield: 0,
              anualIncome: 0,
              description: item.description,
              detail: [],
            };
          } else {
            agregated[item.symbol]["totalShares"] += item.shares;
            agregated[item.symbol]["totalPrice"] += item.shares * item.buyPrice;
          }

          agregated[item.symbol]["detail"].push({
            id: result.id,
            companyName: item.companyName,
            buyPrice: item.buyPrice,
            assetClass: item.assetClass,
            description: item.description,
            symbol: item.symbol,
            shares: item.shares,
            purchaseDate: moment(item.purchaseDate.toDate()).format("YYYY-MM-DD"),
          });
        });
        setGroupBySymbol(agregated);
        setQuotesList(Object.keys(agregated));
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
    setFormValues(initialValueShareForm);
  };

  const updateQuotes = React.useCallback(() => {
    setQuotes(quotesList);
  }, [setQuotes, quotesList]);

  const updateItem = React.useCallback(
    (clicked) => {
      if (!clicked) {
        return;
      }
      setFormValues({
        id: clicked.id,
        symbol: clicked.symbol,
        companyName: clicked.companyName,
        description: clicked.description,
        shares: clicked.shares,
        buyPrice: clicked.buyPrice,
        assetClass: clicked.assetClass,
        purchaseDate: moment(clicked.purchaseDate, "YYYY-MM-DD"),
      });
      setOpenDialog(true);
    },
    [setFormValues, setOpenDialog]
  );

  const deleteItem = React.useCallback((clicked) => {
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
  }, [actions, getData]);

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

    if (mounted) {
      let newData = [];
      for (const symbol in groupBySymbol) {
        if (groupBySymbol.hasOwnProperty(symbol)) {
          const element = groupBySymbol[symbol];
          let marketPrice = 0;
          let dividendYield = 0;
          let anualDividend = 0;

          if (quoteInfo.hasOwnProperty(symbol)) {
            marketPrice = quoteInfo[symbol].regularMarketPrice
              ? quoteInfo[symbol].regularMarketPrice
              : 0;
            dividendYield = quoteInfo[symbol].dividendYield
              ? quoteInfo[symbol].dividendYield
              : 0;
            anualDividend = quoteInfo[symbol].dividendsPerShare
              ? quoteInfo[symbol].dividendsPerShare
              : 0;
          }

          let average = element.totalPrice / element.totalShares;
          let costBasis = element.totalShares * average;
          let marketValue = element.totalShares * marketPrice;
          newData.push({
            ...element,
            averageBuyPrice: average,
            marketPrice: marketPrice,
            costBasis: costBasis,
            marketValue: marketValue,
            gainLoss: marketValue - costBasis,
            growth: (marketValue / costBasis - 1) * 100,
            anualDividend: anualDividend,
            dividendYield: dividendYield,
            anualIncome: (marketValue * dividendYield) / 100,
          });
        }
      }
      setData(newData);
    }

    return () => {
      mounted = false;
    };
  }, [groupBySymbol, quoteInfo]);

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
        title: "Shares",
        dataIndex: "shares",
        key: "shares",
        render: (val: number) => toInteger(val),
        width: "50px",
      },
      {
        title: "Buy price",
        dataIndex: "buyPrice",
        key: "buyPrice",
        render: (val: number) => toCurrency(val),
        width: "50px",
      },
      {
        title: "Asset class",
        dataIndex: "assetClass",
        key: "assetClass",
        width: "50px",
      },
      {
        title: "Purchase date",
        dataIndex: "purchaseDate",
        key: "purchaseDate",
        width: "50px",
      },
    ];

    return (
      <PageHeader
        title={record.companyName}
        subTitle={<Tag color="blue">{record.description}</Tag>}
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
      <DialogShareForm
        visible={openDialog}
        handleCancel={cancelDialog}
        handleOk={confirmDialog}
        defaultValues={formValues}
      />
      <PageHeader
        className="site-page-header"
        title={
          <Title level={2} className="section-title">
            Shares
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
            Add share
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
                  let totalAnualIncome = 0;
                  let totalGrowth = 0;
                  let totalGainLoss = 0;
                  let totalMarketValue = 0;
                  let totalCostBasis = 0;
                  let totalShares = 0;

                  pageData.forEach((row) => {
                    totalShares += row.totalShares;
                    totalCostBasis += row.costBasis;
                    totalMarketValue += row.marketValue;
                    totalGainLoss += row.gainLoss;
                    totalAnualIncome += row.anualIncome;
                  });
                  totalGrowth += (totalMarketValue / totalCostBasis - 1) * 100;

                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={1}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>
                        {toInteger(totalShares)}
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
                      <Table.Summary.Cell index={11}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={12}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={13}>
                        {toCurrency(totalAnualIncome)}
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
          <br />
          <Row justify="end" align="middle">
            <Col>
              <Text type="secondary">
                {localStorage.getItem("market.quotes.lastUpdate")}
              </Text>
            </Col>
            <Col>
              <Button
                type="text"
                shape="circle"
                icon={<ReloadOutlined />}
                onClick={updateQuotes}
              />
            </Col>
          </Row>
        </FadeIn>
      </PageHeader>
    </FadeIn>
  );
};

export default Variable;
