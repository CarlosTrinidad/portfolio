import {
  Button,
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { Controller, useForm } from "react-hook-form";

import { create as CreateValidator } from "../../../validators/Bonds";
import React from "react";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers";

const { Text } = Typography;
const { Option } = Select;

interface DialogBond {
  visible: boolean;
  handleOk: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  handleCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  defaultValues: {
    id: any;
    name: string;
    deadline: number;
    rate: number;
    amount: number;
    startDate: any;
    expirationDate: any;
    grossReturn: number;
    assetClass: null | string;
  };
}

interface BondFields {
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

const calculateGrossReturn = ({
  deadline,
  rate,
  amount,
}: {
  deadline: number;
  rate: number;
  amount: number;
}) => {
  if (Number(deadline) <= 0) {
    return null;
  }
  if (Number(rate) <= 0) {
    return null;
  }
  if (Number(amount) <= 0) {
    return null;
  }

  return Number(
    ((Number(rate) / 360 / 100) * Number(deadline) * Number(amount)).toFixed(2)
  );
};

const suggestExpirationDate = ({
  deadline,
  startDate,
}: {
  deadline: number;
  startDate: any;
}) => {
  if (Number(deadline) <= 0) {
    return null;
  }

  if (!moment(startDate, "YYYY-MM-DD").isValid()) {
    return null;
  }
  return moment(startDate, "YYYY-MM-DD").add(Number(deadline), "days");
};

const DialogBondForm = ({
  visible,
  handleOk,
  handleCancel,
  defaultValues,
}: DialogBond) => {
  const { handleSubmit, errors, control, setValue, reset, watch } = useForm<
    BondFields
  >({
    resolver: yupResolver(CreateValidator),
    defaultValues: defaultValues,
  });

  const expirationFields = watch(["deadline", "startDate"]);
  const grossReturnFields = watch(["deadline", "rate", "amount"]);

  const onSubmit = async (data: BondFields) => {
    console.log(data);
    reset();
  };

  React.useEffect(() => {
    let mounted = true;

    if (mounted) {
      reset(defaultValues);
    }
    return () => {
      mounted = false;
    };
  }, [defaultValues, reset]);

  React.useEffect(() => {
    let mounted = true;

    if (mounted) {
      let sugested = suggestExpirationDate(expirationFields);
      if (sugested !== null) {
        setValue("expirationDate", sugested);
      }
    }
    return () => {
      mounted = false;
    };
  }, [expirationFields, setValue]);

  React.useEffect(() => {
    let mounted = true;

    if (mounted) {
      let sugested = calculateGrossReturn(grossReturnFields);
      if (sugested !== null) {
        setValue("grossReturn", sugested);
      }
    }
    return () => {
      mounted = false;
    };
  }, [grossReturnFields, setValue]);

  return (
    <Modal
      visible={visible}
      title="Fixed investment"
      centered
      onOk={handleOk}
      onCancel={(e) => {
        handleCancel(e);
        reset();
      }}
      footer={[
        <Button
          key="back"
          onClick={(e) => {
            handleCancel(e);
            reset();
          }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={false}
          onClick={handleSubmit(onSubmit)}
        >
          Save
        </Button>,
      ]}
      width={820}
    >
      <form>
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Space
              direction="vertical"
              style={{
                display: "block",
              }}
            >
              <Text strong>Name:</Text>
              <Controller
                as={<Input type="text" />}
                name="name"
                control={control}
              />
              <Text type="danger">{errors.name?.message}</Text>
            </Space>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col xs={8}>
            <Space
              direction="vertical"
              style={{
                display: "block",
              }}
            >
              <Text strong>Deadline:</Text>
              <Controller
                as={<Input type="number" step="1" min="1" />}
                name="deadline"
                control={control}
              />
              <Text type="danger">{errors.deadline?.message}</Text>
            </Space>
          </Col>
          <Col xs={8}>
            <Space
              direction="vertical"
              style={{
                display: "block",
              }}
            >
              <Text strong>Rate:</Text>
              <Controller
                as={<Input type="number" suffix="%" />}
                name="rate"
                control={control}
              />
              <Text type="danger">{errors.rate?.message}</Text>
            </Space>
          </Col>
          <Col xs={8}>
            <Space
              direction="vertical"
              style={{
                display: "block",
              }}
            >
              <Text strong>Amount:</Text>
              <Controller
                as={<Input type="number" prefix="$" />}
                name="amount"
                control={control}
              />
              <Text type="danger">{errors.amount?.message}</Text>
            </Space>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col xs={8}>
            <Space
              direction="vertical"
              style={{
                display: "block",
              }}
            >
              <Text strong>Gross return:</Text>
              <Controller
                as={<Input type="number" prefix="$" />}
                name="grossReturn"
                control={control}
              />
              <Text type="danger">{errors.grossReturn?.message}</Text>
            </Space>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col xs={12}>
            <Space
              direction="vertical"
              style={{
                display: "block",
              }}
            >
              <Text strong>Asset class (optional):</Text>
              <Controller
                as={
                  <Select
                    dropdownMatchSelectWidth={false}
                    placeholder="Select asset class"
                  >
                    <Option value="US Equities">US Equities </Option>
                    <Option value="Emerging Market Equities">
                      Emerging Market Equities
                    </Option>
                    <Option value="Real Estate Funds">Real Estate Funds</Option>
                    <Option value="Goverment Bonds">Goverment Bonds </Option>
                    <Option value="Treasury Inflation Protected Securities">
                      Treasury Inflation Protected Securities
                    </Option>
                    <Option value="Developing World International Equities">
                      Developing World International Equities
                    </Option>
                    <Option value="Money Market">Money Market </Option>
                  </Select>
                }
                name="assetClass"
                control={control}
              />
              <Text type="danger">{errors.assetClass?.message}</Text>
            </Space>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col xs={8}>
            <Space
              direction="vertical"
              style={{
                display: "block",
              }}
            >
              <Text strong>Start date:</Text>
              <Controller
                as={<DatePicker style={{ width: "100%" }} />}
                name="startDate"
                control={control}
              />
              <Text type="danger">{errors.startDate?.message}</Text>
            </Space>
          </Col>
          <Col xs={8}>
            <Space
              direction="vertical"
              style={{
                display: "block",
              }}
            >
              <Text strong>Expiration date:</Text>
              <Controller
                as={<DatePicker style={{ width: "100%" }} />}
                name="expirationDate"
                control={control}
              />
              <Text type="danger">{errors.expirationDate?.message}</Text>
            </Space>
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

export default DialogBondForm;
