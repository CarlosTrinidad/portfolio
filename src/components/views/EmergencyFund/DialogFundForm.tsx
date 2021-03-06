import {
  Button,
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import {
  notificationError,
  notificationSuccess,
} from "../../common/Notification/notification";

import { create as CreateValidator } from "../../../validators/EmergencyFund";
import React from "react";
import moment from "moment";
import { useEmergencyFundActions } from "../../../hooks/useEmergencyFund";
import { yupResolver } from "@hookform/resolvers";

const { Text } = Typography;

interface DialogFund {
  visible: boolean;
  handleOk: (e: React.MouseEvent<HTMLElement, MouseEvent> | null) => void;
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
  };
}

interface FundFields {
  id: any;
  name: string;
  deadline: number;
  rate: number;
  amount: number;
  startDate: any;
  expirationDate: any;
  grossReturn: number;
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

const DialogFundForm = ({
  visible,
  handleOk,
  handleCancel,
  defaultValues,
}: DialogFund) => {
  const {
    handleSubmit,
    errors,
    control,
    setValue,
    reset,
    watch,
  } = useForm<FundFields>({
    resolver: yupResolver(CreateValidator),
    defaultValues: defaultValues,
  });

  const [loading, setLoading] = React.useState<boolean>(false);
  const expirationFields = watch(["deadline", "startDate"]);
  const grossReturnFields = watch(["deadline", "rate", "amount"]);
  const metadata = watch(["id"]);

  const actions = useEmergencyFundActions();

  const onSubmit = React.useCallback(
    async (data: FundFields) => {
      setLoading(true);
      try {
        if (metadata.id === "") {
          await actions.create(data);
        } else {
          await actions.update(metadata.id, data);
        }
        notificationSuccess({
          message: "Saved ;)",
          description: "Data has been saved successfully!",
        });
        handleOk(null);
        reset();
      } catch (error) {
        notificationError({
          message: "Error :(",
          description: error.message,
        });
      }
      setLoading(false);
    },
    [actions, handleOk, metadata.id, reset]
  );

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
      title="Fund"
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
          loading={loading}
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

export default DialogFundForm;
