import {
  AutoComplete,
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
import {
  notificationError,
  notificationSuccess,
} from "../../common/Notification/notification";

import { create as CreateValidator } from "../../../validators/Shares";
import React from "react";
import { SelectProps } from "antd/es/select";
import { useVariableActions } from "../../../hooks/useVariable";
import yFinanceApi from "../../../api/YahooFinance";
import { yupResolver } from "@hookform/resolvers";

const { Text, Paragraph, Title } = Typography;
const { Option } = Select;

interface DialogShare {
  visible: boolean;
  handleOk: (e: React.MouseEvent<HTMLElement, MouseEvent> | null) => void;
  handleCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  defaultValues: {
    id: any;
    symbol: string;
    companyName: string;
    description: string;
    shares: number;
    buyPrice: number;
    assetClass: null | string;
    purchaseDate: any;
  };
}

interface ShareFields {
  id: any;
  symbol: string;
  companyName: string;
  description: string;
  shares: number;
  buyPrice: number;
  assetClass: string | null;
  purchaseDate: any;
}

const searchResult = async (
  query: string,
  setLoadingSymbols: React.Dispatch<React.SetStateAction<boolean>>
) => {
  let array: any[] = [];
  setLoadingSymbols(true);
  try {
    let response = await yFinanceApi.get("/market/auto-complete", {
      params: {
        lang: "en",
        region: "US",
        query: query,
      },
    });
    if (
      response.data.hasOwnProperty("ResultSet") &&
      response.data.ResultSet.hasOwnProperty("Result")
    ) {
      let result = response.data.ResultSet.Result;
      array = result.map((res: any) => {
        return {
          value: res.symbol,
          label: (
            <>
              <Title level={5}>{res.symbol}</Title>
              <Paragraph>
                <Text type="secondary">{res.name}</Text>
              </Paragraph>
            </>
          ),
          description: res.typeDisp,
          companyname: res.name,
        };
      });
    }
  } catch (error) {
    notificationError({
      message: "Error :(",
      description: "Somenthing went wrong reaching Yahoo API, try again.",
    });
  }
  setLoadingSymbols(false);
  return array;
};

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

const DialogShareForm = ({
  visible,
  handleOk,
  handleCancel,
  defaultValues,
}: DialogShare) => {
  const { handleSubmit, errors, control, setValue, reset, watch } = useForm<
  ShareFields
  >({
    resolver: yupResolver(CreateValidator),
    defaultValues: defaultValues,
  });
  
  const [options, setOptions] = React.useState<SelectProps<object>["options"]>(
    []
  );
  const [loadingSymbols, setLoadingSymbols] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const actions = useVariableActions();
  const metadata = watch(["id"]);
  
  const onSubmit = React.useCallback(async (data: ShareFields) => {
    setLoading(true);
    try {
      if (metadata.id === "") {
        await actions.create(data);
      }else{
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
  }, [actions, handleOk, metadata.id, reset]);

  const handleSearch = async (value: string) => {
    setOptions(value ? await searchResult(value, setLoadingSymbols) : []);
  };

  const debounceOnChange = React.useCallback(debounce(handleSearch, 800), []);

  const onSelect = (value: string, option: any) => {
    setValue("companyName", option.companyname);
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
      title="Share"
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
                    <Input.Search enterButton loading={loadingSymbols} />
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
                name="companyName"
                control={control}
              />
              <Text type="danger">{errors.companyName?.message}</Text>
            </Space>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Space
              direction="vertical"
              style={{
                display: "block",
              }}
            >
              <Text strong>Description (optional):</Text>
              <Controller
                as={<Input.TextArea rows={2} />}
                name="description"
                control={control}
              />
              <Text type="danger">{errors.description?.message}</Text>
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
              <Text strong>Shares:</Text>
              <Controller
                as={<Input type="number" step="1" min="1" />}
                name="shares"
                control={control}
              />
              <Text type="danger">{errors.shares?.message}</Text>
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

export default DialogShareForm;
