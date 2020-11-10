import {
  Button,
  Col,
  Dropdown,
  Menu,
  PageHeader,
  Row,
  Table,
  Tag,
  Typography,
} from "antd";
import { numberSorter, stringSorter } from "../../../utils/sort";
import { toCurrency, toDecimal, toInteger } from "../../../utils/formatable";

import DialogShareForm from "./DialogShareForm";
import FadeIn from "react-fade-in";
import React from "react";
import { ReloadOutlined } from "@ant-design/icons";
import create from "zustand";
import moment from "moment";
import useMarketQuotes from "../../../hooks/useMarketQuotes";

const { Title, Text } = Typography;

// Delete eventually
const columns = [
  {
    title: "Company name",
    dataIndex: "name",
    key: "name",
    sorter: (a: any, b: any) => stringSorter(a.name, b.name),
    width: "225px",
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
    sorter: (a: any, b: any) => stringSorter(a.name, b.name),
    width: "120px",
  },
  {
    title: "Shares",
    dataIndex: "total_shares",
    key: "total_shares",
    sorter: (a: any, b: any) => numberSorter(a.total_shares, b.total_shares),
    render: (val: number) => toInteger(val),
    width: "110px",
  },
  {
    title: "Avg. Buy Price",
    dataIndex: "average_buy_price",
    key: "average_buy_price",
    sorter: (a: any, b: any) =>
      numberSorter(a.average_buy_price, b.average_buy_price),
    render: (val: number) => toCurrency(val),
    width: "155px",
  },
  {
    title: "Market Price",
    dataIndex: "market_price",
    key: "market_price",
    sorter: (a: any, b: any) => numberSorter(a.market_price, b.market_price),
    render: (val: number) => toCurrency(val),
    width: "155px",
  },
  {
    title: "Cost Basis",
    dataIndex: "cost_basis",
    key: "cost_basis",
    sorter: (a: any, b: any) => numberSorter(a.cost_basis, b.cost_basis),
    render: (val: number) => toCurrency(val),
    width: "145px",
  },
  {
    title: "Market Value",
    key: "market_value",
    dataIndex: "market_value",
    sorter: (a: any, b: any) => numberSorter(a.market_value, b.market_value),
    render: (val: number) => toCurrency(val),
    width: "145px",
  },
  {
    title: "Gain/Loss",
    dataIndex: "gain_loss",
    key: "gain_loss",
    sorter: (a: any, b: any) => numberSorter(a.gain_loss, b.gain_loss),
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
    dataIndex: "anual_dividend",
    key: "anual_dividend",
    sorter: (a: any, b: any) =>
      numberSorter(a.anual_dividend, b.anual_dividend),
    render: (val: number) => toCurrency(val),
    width: "170px",
  },
  {
    title: "Dividend Yield",
    dataIndex: "dividend_yield",
    key: "dividend_yield",
    sorter: (a: any, b: any) =>
      numberSorter(a.dividend_yield, b.dividend_yield),
    render: (val: number) => toDecimal(val) + "%",
    width: "155px",
  },

  {
    title: "Anual Income",
    dataIndex: "anual_income",
    key: "anual_income",
    sorter: (a: any, b: any) => numberSorter(a.anual_income, b.anual_income),
    render: (val: number) => toCurrency(val),
    width: "160px",
  },
];

const data = [
  {
    detail: [
      {
        id: 5,
        name: "Fibra Mty, S.A.P.I. de C.V.",
        symbol: "FMTY14.MX",
        description: "Equity",
        shares: 9000,
        buy_price: "9.41",
        purchase_date: "2020-07-19",
        asset_class_id: 3,
        created_at: "2020-07-20T04:34:22.000000Z",
        updated_at: "2020-09-29T02:40:44.000000Z",
        asset_class: {
          id: 3,
          name: "Real Estate Funds",
          created_at: "2020-07-21T02:33:08.000000Z",
          updated_at: "2020-07-21T02:33:08.000000Z",
        },
      },
    ],
    market_price: 10.09,
    cost_basis: 84.69,
    market_value: 90.81,
    gain_loss: 6.1200000000000045,
    growth: 7.226354941551549,
    anual_dividend: 0.45,
    dividend_yield: 1.75,
    anual_income: 1.5891750000000002,
    id: 5,
    name: "Fibra Mty, S.A.P.I. de C.V.",
    symbol: "FMTY14.MX",
    description: "Equity",
    shares: 9000,
    buy_price: "9.41",
    purchase_date: "2020-07-19",
    asset_class_id: 3,
    created_at: "2020-07-20T04:34:22.000000Z",
    updated_at: "2020-09-29T02:40:44.000000Z",
    total_shares: "9000",
    average_buy_price: "9.410000",
  },
  {
    detail: [],
    market_price: 16.93,
    cost_basis: 3526.39998,
    market_value: 3047.4,
    gain_loss: -478.99998000000005,
    growth: -13.583257223135536,
    anual_dividend: 2.05,
    dividend_yield: 10.18,
    anual_income: 310.22532,
    id: 6,
    name: "Fibra UNO",
    symbol: "FUNO11.MX",
    description: "Equity",
    shares: 160,
    buy_price: "19.94",
    purchase_date: "2020-07-19",
    asset_class_id: 3,
    created_at: "2020-07-20T04:35:20.000000Z",
    updated_at: "2020-09-01T02:31:44.000000Z",
    total_shares: "180",
    average_buy_price: "19.591111",
  },
  {
    detail: [],
    market_price: 4.51,
    cost_basis: 1269.10014,
    market_value: 1389.08,
    gain_loss: 119.97985999999992,
    growth: 9.453931665313654,
    anual_dividend: 0.81,
    dividend_yield: 17.69,
    anual_income: 245.728252,
    id: 4,
    name: "FibraHotel",
    symbol: "FIHO12.MX",
    description: "Equity",
    shares: 198,
    buy_price: "4.05",
    purchase_date: "2020-07-19",
    asset_class_id: 3,
    created_at: "2020-07-20T04:32:02.000000Z",
    updated_at: "2020-07-22T04:35:08.000000Z",
    total_shares: "308",
    average_buy_price: "4.120455",
  },
  {
    detail: [],
    market_price: 36.912453,
    cost_basis: 4278.08,
    market_value: 4281.844548,
    gain_loss: 3.7645480000001044,
    growth: 0.0879962039045612,
    anual_dividend: 0,
    dividend_yield: 0,
    anual_income: 0,
    id: 12,
    name: "GBM Fondo de Corto Plazo SA de CV S.I.I.D. BF",
    symbol: "GBMF2BF.MX",
    description: "Fund",
    shares: 116,
    buy_price: "36.88",
    purchase_date: "2020-09-03",
    asset_class_id: 7,
    created_at: "2020-08-02T02:32:20.000000Z",
    updated_at: "2020-10-05T02:19:42.000000Z",
    total_shares: "116",
    average_buy_price: "36.880000",
  },
  {
    detail: [],
    market_price: 2.408922,
    cost_basis: 621.98,
    market_value: 660.044628,
    gain_loss: 38.06462799999997,
    growth: 6.119911894273122,
    anual_dividend: 0,
    dividend_yield: 0,
    anual_income: 0,
    id: 8,
    name:
      "GBM Inv. en Índices Internacionales de Renta Variable SA de CV F.I.R.V. BO",
    symbol: "GBMTRVBO.MX",
    description: "Fund",
    shares: 274,
    buy_price: "2.27",
    purchase_date: "2020-07-19",
    asset_class_id: 1,
    created_at: "2020-07-20T04:39:59.000000Z",
    updated_at: "2020-08-05T01:58:43.000000Z",
    total_shares: "274",
    average_buy_price: "2.270000",
  },
  {
    detail: [],
    market_price: 13.008585,
    cost_basis: 894.25,
    market_value: 949.626705,
    gain_loss: 55.376705000000015,
    growth: 6.192530612244895,
    anual_dividend: 0,
    dividend_yield: 0,
    anual_income: 0,
    id: 7,
    name: "GBM Inversiones Internacionales SA de CV F.I.R.V. BO",
    symbol: "GBMINTBO.MX",
    description: "Fund",
    shares: 73,
    buy_price: "12.25",
    purchase_date: "2020-07-19",
    asset_class_id: 1,
    created_at: "2020-07-20T04:37:05.000000Z",
    updated_at: "2020-07-22T04:34:21.000000Z",
    total_shares: "73",
    average_buy_price: "12.250000",
  },
  {
    detail: [],
    market_price: 785,
    cost_basis: 1580.64,
    market_value: 1570,
    gain_loss: -10.6400000000001,
    growth: -0.6731450551675344,
    anual_dividend: 0,
    dividend_yield: 0,
    anual_income: 0,
    id: 3,
    name: "The Real Estate Select Sector SPDR Fund",
    symbol: "XLRE.MX",
    description: "ETF",
    shares: 2,
    buy_price: "790.32",
    purchase_date: "2020-07-19",
    asset_class_id: 3,
    created_at: "2020-07-20T04:31:11.000000Z",
    updated_at: "2020-07-22T04:33:14.000000Z",
    total_shares: "2",
    average_buy_price: "790.320000",
  },
  {
    detail: [],
    market_price: 958,
    cost_basis: 6717.000003,
    market_value: 6706,
    gain_loss: -11.000003000000106,
    growth: -0.16376362952340573,
    anual_dividend: 0,
    dividend_yield: 0,
    anual_income: 0,
    id: 9,
    name: "Vanguard FTSE Emerging Markets Index Fund ETF Shares",
    symbol: "VWO.MX",
    description: "ETF",
    shares: 2,
    buy_price: "971.00",
    purchase_date: "2020-07-21",
    asset_class_id: 2,
    created_at: "2020-07-21T01:30:13.000000Z",
    updated_at: "2020-07-22T04:33:01.000000Z",
    total_shares: "7",
    average_buy_price: "959.571429",
  },
  {
    detail: [],
    market_price: 1768.5,
    cost_basis: 5280,
    market_value: 5305.5,
    gain_loss: 25.5,
    growth: 0.4829545454545503,
    anual_dividend: 0,
    dividend_yield: 0,
    anual_income: 0,
    id: 1,
    name: "Vanguard Real Estate Index Fund ETF Shares",
    symbol: "VNQ.MX",
    description: "ETF",
    shares: 3,
    buy_price: "1760.00",
    purchase_date: "2020-07-20",
    asset_class_id: 3,
    created_at: "2020-07-20T04:26:45.000000Z",
    updated_at: "2020-07-22T04:32:49.000000Z",
    total_shares: "3",
    average_buy_price: "1760.000000",
  },
  {
    detail: [],
    market_price: 6831.99,
    cost_basis: 19196.97,
    market_value: 20495.97,
    gain_loss: 1299,
    growth: 6.766692868718338,
    anual_dividend: 0,
    dividend_yield: 1.74,
    anual_income: 356.629878,
    id: 2,
    name: "Vanguard S&P 500 ETF",
    symbol: "VOO.MX",
    description: "ETF",
    shares: 3,
    buy_price: "6398.99",
    purchase_date: "2020-07-19",
    asset_class_id: 1,
    created_at: "2020-07-20T04:29:44.000000Z",
    updated_at: "2020-07-24T04:34:04.000000Z",
    total_shares: "3",
    average_buy_price: "6398.990000",
  },
  {
    detail: [],
    market_price: 899.99,
    cost_basis: 11777.990003,
    market_value: 11699.87,
    gain_loss: -78.120003,
    growth: -0.6632710927764518,
    anual_dividend: 0,
    dividend_yield: 2.49,
    anual_income: 291.326763,
    id: 10,
    name: "Vanguard Tax-Managed Funds - Vanguard FTSE Developed Markets ETF",
    symbol: "VEA.MX",
    description: "ETF",
    shares: 4,
    buy_price: "885.00",
    purchase_date: "2020-07-31",
    asset_class_id: 6,
    created_at: "2020-08-02T02:06:00.000000Z",
    updated_at: "2020-08-02T02:06:00.000000Z",
    total_shares: "13",
    average_buy_price: "905.999231",
  },
];

// Delete eventually
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

interface SelectedStore {
  clicked: any;
  setClicked: any;
}

const useStore = create<SelectedStore>((set) => ({
  clicked: null,
  setClicked: (param: any) => set({ clicked: param }),
}));

const Variable: React.FC = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [formValues, setFormValues] = React.useState<ShareForm>(
    initialValueShareForm
  );
  const [quoteInfo, setQuotes] = useMarketQuotes();

  console.log("Variable:React.FC -> quotesInfo", quoteInfo);

  const cancelDialog = () => {
    setOpenDialog(false);
  };

  const confirmDialog = () => {
    setOpenDialog(false);
  };

  const showDialog = () => {
    setOpenDialog(true);
    setFormValues(initialValueShareForm);
  };

  const updateQuotes = React.useCallback(() => {
    setQuotes(["FUNO11.MX", "FMTY14.MX"]);
  }, [setQuotes]);

  const updateItem = React.useCallback(
    (clicked) => {
      console.log("update ", clicked);
      if (!clicked) {
        return;
      }
      setFormValues({
        id: clicked.key,
        symbol: "clicked.symbol",
        companyName: "clicked.name",
        description: "clicked.description",
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
    console.log("delete", clicked);
    if (!clicked) {
      return;
    }
  }, []);

  const DropdowRow: React.FC = (props) => {
    const { clicked } = useStore();
    console.log("clicked", clicked);

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
        title: "Share",
        dataIndex: "share",
        key: "share",
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
        dataIndex: "puchaseDate",
        key: "puchaseDate",
        width: "50px",
      },
    ];

    const dataDetails = [
      {
        key: 1,
        share: 5,
        buyPrice: 52.02,
        assetClass: "Test test",
        purchaseDate: moment().format("YYYY-MM-DD"),
      },
    ];

    return (
      <PageHeader
        title={record.name}
        subTitle={<Tag color="blue">{record.description}</Tag>}
      >
        <Table
          components={{
            body: {
              row: DropdowRow,
            },
          }}
          bordered
          rowKey="key"
          columns={columnsDetail}
          dataSource={dataDetails}
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
            Variable investment
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
            Add variable investment
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

                  pageData.forEach(({ market_price }) => {
                    totalShares += 1;
                    totalCostBasis += Math.random() * 100;
                    totalMarketValue += Math.random() * 10;
                    totalGainLoss += Math.random() * 10;
                    totalGrowth += Math.random() * 10;
                    totalAnualIncome += Math.random() * 100;
                  });

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
