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

import DialogBondForm from "./DialogBondForm";
import FadeIn from "react-fade-in";
import React from "react";
import moment from "moment";

const { Title } = Typography;

interface BondForm {
  id: any;
  name: string;
  deadline: number;
  rate: number;
  amount: number;
  startDate: any;
  expirationDate: any;
  grossReturn: number;
  assetClass: null | string;
}

const data = [
  {
    id: 7,
    name: "SuperTasas 364 x 28 días",
    rate: "9.50",
    deadline: 28,
    amount: "11000.00",
    startDate: "2020-08-22",
    expirationDate: "2020-10-19",
    grossReturn: "81.28",
    asset_class_id: 7,
    created_at: "2020-08-02T04:38:23.000000Z",
    updated_at: "2020-10-10T18:29:05.000000Z",
    asset_class: {
      id: 7,
      name: "Money Market",
      created_at: "2020-08-01T10:30:40.000000Z",
      updated_at: "2020-08-01T10:30:40.000000Z",
    },
  },
  {
    id: 9,
    name: "CETES 28D",
    rate: "4.22",
    deadline: 28,
    amount: "8114.56",
    startDate: "2020-10-15",
    expirationDate: "2020-11-12",
    grossReturn: "26.63",
    asset_class_id: 4,
    created_at: "2020-09-01T02:43:22.000000Z",
    updated_at: "2020-10-18T17:02:37.000000Z",
    asset_class: {
      id: 4,
      name: "Goverment Bonds",
      created_at: "2020-07-21T02:33:24.000000Z",
      updated_at: "2020-07-21T02:33:24.000000Z",
    },
  },
];

const initialValueShareForm = {
  id: "",
  name: "",
  deadline: 0,
  rate: 0,
  amount: 0,
  startDate: moment(),
  expirationDate: moment(),
  assetClass: null,
  grossReturn: 0,
};

const Fixed: React.FC = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [clicked, setClicked] = React.useState<any>(null);
  const [formValues, setFormValues] = React.useState<BondForm>(
    initialValueShareForm
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => stringSorter(a.name, b.name),
      width: "160px",
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      sorter: (a: any, b: any) => numberSorter(a.rate, b.rate),
      render: (val: number) => toDecimal(val) + "%",

      width: "160px",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      sorter: (a: any, b: any) => numberSorter(a.deadline, b.deadline),
      render: (val: number) => toInteger(val),
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
      title: "Gross return",
      dataIndex: "grossReturn",
      key: "grossReturn",
      sorter: (a: any, b: any) => numberSorter(a.grossReturn, b.grossReturn),
      render: (val: number) => toCurrency(val),
      width: "160px",
    },
    {
      title: "Start date",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a: any, b: any) => stringSorter(a.startDate, b.startDate),
      width: "160px",
    },
    {
      title: "Expiration date",
      dataIndex: "expirationDate",
      key: "expirationDate",
      sorter: (a: any, b: any) =>
        stringSorter(a.expirationDate, b.expirationDate),
      render: (value: string) => {
        let day = moment(value, "YYYY-MM-DD", "es");
        let diff = day.diff(moment(), "days");
        if (moment().isSame(day.format("YYYY-MM-DD"), "day")) {
          // today
          return (
            <Tag color="orange" key={value}>
              {value}
            </Tag>
          );
        } else if (diff <= 7 && diff >= 0) {
          // less than 7 days
          return (
            <Tag color="green" key={value}>
              {value}
            </Tag>
          );
        } else if (moment().isAfter(day.format("YYYY-MM-DD"), "day")) {
          //past
          return (
            <Tag color="red" key={value}>
              {value}
            </Tag>
          );
        }

        return <Tag key={value}>{value}</Tag>;
      },
      width: "180px",
    },
  ];

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

  const updateItem = React.useCallback(() => {
    console.log("update ", clicked);

    if (!clicked) {
      return
    }

    setFormValues({
      id: clicked.key,
      name: clicked.name,
      deadline: clicked.deadline,
      rate: clicked.rate,
      amount: clicked.amount,
      startDate: moment(clicked.startDate),
      expirationDate: moment(clicked.expirationDate),
      assetClass: clicked.assetClass,
      grossReturn: clicked.grossReturn,
    });
    setOpenDialog(true);
  }, [clicked]);

  const deleteItem = React.useCallback(() => {
    if (!clicked) {
      return;
    }
    console.log("delete", clicked);
  }, [clicked]);

  const DropdowRow: React.FC = (props) => {
    return (
      <Dropdown
        arrow
        overlay={() => (
          <Menu>
            <Menu.Item key="0" onClick={updateItem}>
              Edit
            </Menu.Item>
            <Menu.Item key="1" onClick={deleteItem} danger>
              Delete
            </Menu.Item>
          </Menu>
        )}
        trigger={["contextMenu"]}
      >
        <tr {...props} />
      </Dropdown>
    );
  };

  return (
    <FadeIn>
      <DialogBondForm
        visible={openDialog}
        handleCancel={cancelDialog}
        handleOk={confirmDialog}
        defaultValues={formValues}
      />
      <PageHeader
        className="site-page-header"
        title={
          <Title level={2} className="section-title">
            Fixed investment
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
            Add fixed investment
          </Button>,
        ]}
      >
        <FadeIn>
          <Row justify="center" align="middle">
            <Col xs={24}>
              <Table
                components={{
                  body: {
                    row: DropdowRow,
                  },
                }}
                rowKey="id"
                columns={columns}
                dataSource={data}
                pagination={false}
                tableLayout="fixed"
                scroll={{
                  x: "90vw",
                }}
                bordered
                onRow={(record, rowIndex) => {
                  return {
                    onContextMenu: (event) => {
                      setClicked(record);
                    }, // right button click row
                  };
                }}
              />
            </Col>
          </Row>
        </FadeIn>
      </PageHeader>
    </FadeIn>
  );
};

export default Fixed;
