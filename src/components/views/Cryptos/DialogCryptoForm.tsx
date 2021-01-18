import {
  AutoComplete,
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

import { create as CreateValidator } from "../../../validators/Cryptos";
import React from "react";
import { SelectProps } from "antd/es/select";
import { useCryptosActions } from "../../../hooks/useCryptos";
import { yupResolver } from "@hookform/resolvers";

const { Text, Paragraph, Title } = Typography;

interface DialogCrypto {
  visible: boolean;
  handleOk: (e: React.MouseEvent<HTMLElement, MouseEvent> | null) => void;
  handleCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  defaultValues: {
    id: any;
    symbol: string;
    name: string;
    amount: number;
    buyPrice: number;
    purchaseDate: any;
  };
}

interface CryptoFields {
  id: any;
  symbol: string;
  name: string;
  amount: number;
  buyPrice: number;
  purchaseDate: any;
}

const cryptosList = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "XRP", name: "Ripple" },
  { symbol: "BCH", name: "Bitcoin Cash" },
  { symbol: "ADA", name: "Cardano" },
  { symbol: "LTC", name: "Litecoin" },
  { symbol: "XEM", name: "NEM" },
  { symbol: "XLM", name: "Stellar" },
  { symbol: "EOS", name: "EOS" },
  { symbol: "NEO", name: "NEO" },
  { symbol: "MIOTA", name: "IOTA" },
  { symbol: "DASH", name: "Dash" },
  { symbol: "XMR", name: "Monero" },
  { symbol: "TRX", name: "TRON" },
  { symbol: "XTZ", name: "Tezos" },
  { symbol: "DOGE", name: "Dogecoin" },
  { symbol: "ETC", name: "Ethereum Classic" },
  { symbol: "VEN", name: "VeChain" },
  { symbol: "USDT", name: "Tether" },
  { symbol: "BNB", name: "Binance Coin" },
];

function debounce(func: any, wait: any) {
  let timeout: any;
  return function (this: any, ...args: any) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

const DialogCryptoForm = ({
  visible,
  handleOk,
  handleCancel,
  defaultValues,
}: DialogCrypto) => {
  const {
    handleSubmit,
    errors,
    control,
    setValue,
    reset,
    watch,
  } = useForm<CryptoFields>({
    resolver: yupResolver(CreateValidator),
    defaultValues: defaultValues,
  });

  const [options, setOptions] = React.useState<SelectProps<object>["options"]>(
    []
  );

  const [loading, setLoading] = React.useState<boolean>(false);
  const actions = useCryptosActions();
  const metadata = watch(["id"]);

  const onSubmit = React.useCallback(
    async (data: CryptoFields) => {
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

  const handleSearch = async (value: string) => {
    let result = [];

    for (var j = 0; j < cryptosList.length; j++) {
      if (cryptosList[j].name.toLowerCase().match(value.toLowerCase())) {
        result.push({
          value: cryptosList[j].symbol,
          label: (
            <>
              <Title level={5}>{cryptosList[j].symbol}</Title>
              <Paragraph>
                <Text type="secondary">{cryptosList[j].name}</Text>
              </Paragraph>
            </>
          ),
          description: cryptosList[j].symbol,
          name: cryptosList[j].name,
        });
      }
    }

    setOptions(result);
  };

  const debounceOnChange = React.useCallback(debounce(handleSearch, 800), []);

  const onSelect = (value: string, option: any) => {
    setValue("name", option.name);
    setValue("description", option.description);
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

  return (
    <Modal
      visible={visible}
      title="Cryptocurrencies"
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
          <Col xs={12}>
            <Space
              direction="vertical"
              style={{
                display: "block",
              }}
            >
              <Text strong>Symbol:</Text>
              <Controller
                as={
                  <AutoComplete
                    dropdownMatchSelectWidth={false}
                    options={options}
                    onSelect={onSelect}
                    onSearch={debounceOnChange}
                    style={{ width: "100%" }}
                  >
                    <Input.Search enterButton />
                  </AutoComplete>
                }
                name="symbol"
                control={control}
              />
              <Text type="danger">{errors.symbol?.message}</Text>
            </Space>
          </Col>
          <Col xs={12}>
            <Space
              direction="vertical"
              style={{
                display: "block",
              }}
            >
              <Text strong>Company name:</Text>
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
          <Col xs={12}>
            <Space
              direction="vertical"
              style={{
                display: "block",
              }}
            >
              <Text strong>Amount:</Text>
              <Controller
                as={<Input type="number" />}
                name="amount"
                control={control}
              />
              <Text type="danger">{errors.amount?.message}</Text>
            </Space>
          </Col>
          <Col xs={12}>
            <Space
              direction="vertical"
              style={{
                display: "block",
              }}
            >
              <Text strong>Buy price:</Text>
              <Controller
                as={<Input type="number" />}
                name="buyPrice"
                control={control}
              />
              <Text type="danger">{errors.buyPrice?.message}</Text>
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
              <Text strong>Purchase date (optional):</Text>
              <Controller
                as={<DatePicker style={{ width: "100%" }} />}
                name="purchaseDate"
                control={control}
              />
              <Text type="danger">{errors.purchaseDate?.message}</Text>
            </Space>
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

export default DialogCryptoForm;
