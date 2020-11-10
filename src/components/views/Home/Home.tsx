import "./Home.css";

import { Card, Carousel, Col, Row, Typography } from "antd";

import AssetClassPie from "./AssetClassPie";
import CalculatorPie from "./CalculatorPie";
import CalculatorTable from "./CalculatorTable";
import DetailPie from "./DetailPie";
import FadeIn from "react-fade-in";
import GeneralPie from "./GeneralPie";
import React from "react";
import useAssetsContext from "../../../store/assets";

const { Text } = Typography;
const Home: React.FC = () => {
  const { setCustom, setOriginal } = useAssetsContext();

  React.useEffect(() => {
    let mounted = true;

    if (mounted) {
      setOriginal([
        {
          id: 1,
          assetClass: "US Equities",
          amount: 28358.63,
          weights: 33.549,
          gainLoss: 0,
        },
        {
          id: 2,
          assetClass: "Money Market",
          amount: 18899.26,
          weights: 22.359,
          gainLoss: 0,
        },
        {
          id: 3,
          assetClass: "Real Estate Funds",
          amount: 10922.35,
          weights: 12.922,
          gainLoss: 0,
        },
        {
          id: 4,
          assetClass: "Developing World International Equities",
          amount: 10555.08,
          weights: 12.487,
          gainLoss: 0,
        },
        {
          id: 5,
          assetClass: "Goverment Bonds",
          amount: 8114.56,
          weights: 9.6,
          gainLoss: 0,
        },
        {
          id: 6,
          assetClass: "Emerging Market Equities",
          amount: 7678.06,
          weights: 9.083,
          gainLoss: 0,
        },
        {
          id: 7,
          assetClass: "Treasury Inflation Protected Securities	",
          amount: 0,
          weights: 0,
          gainLoss: 0,
        },
        {
          id: 8,
          assetClass: "Other",
          amount: 0,
          weights: 0,
          gainLoss: 0,
        },
      ]);
      setCustom([
        {
          id: 1,
          assetClass: "US Equities",
          amount: 28358.63,
          weights: 33.549,
          gainLoss: 0,
        },
        {
          id: 2,
          assetClass: "Money Market",
          amount: 18899.26,
          weights: 22.359,
          gainLoss: 0,
        },
        {
          id: 3,
          assetClass: "Real Estate Funds",
          amount: 10922.35,
          weights: 12.922,
          gainLoss: 0,
        },
        {
          id: 4,
          assetClass: "Developing World International Equities",
          amount: 10555.08,
          weights: 12.487,
          gainLoss: 0,
        },
        {
          id: 5,
          assetClass: "Goverment Bonds",
          amount: 8114.56,
          weights: 9.6,
          gainLoss: 0,
        },
        {
          id: 6,
          assetClass: "Emerging Market Equities",
          amount: 7678.06,
          weights: 9.083,
          gainLoss: 0,
        },
        {
          id: 7,
          assetClass: "Treasury Inflation Protected Securities	",
          amount: 0,
          weights: 0,
          gainLoss: 0,
        },
        {
          id: 8,
          assetClass: "Other",
          amount: 0,
          weights: 0,
          gainLoss: 0,
        },
      ]);
    }

    return () => {
      mounted = false;
    };
  }, [setCustom, setOriginal]);

  return (
    <FadeIn>
      <Row gutter={[16, 16]}>
        <Col lg={8} md={12} sm={0} xs={0}>
          <Card title="General" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text type="secondary">
                  An overview of the distribution of your investments.
                </Text>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <GeneralPie />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg={8} md={12} sm={0} xs={0}>
          <Card title="Asset Class" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text type="secondary">
                  An overview of the distribution of your investments by asset
                  class.
                </Text>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <AssetClassPie />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg={8} md={24} sm={0} xs={0}>
          <Card title="Detail" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text type="secondary">
                  A detailed overview of yout investments.
                </Text>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <DetailPie />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
          <Carousel>
            <div>
              <Card title="General" bordered={false}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Text type="secondary">
                      An overview of the distribution of your investments.
                    </Text>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <GeneralPie />
                  </Col>
                </Row>
              </Card>
            </div>
            <div>
              <Card title="Asset Class" bordered={false}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Text type="secondary">
                      An overview of the distribution of your investments by
                      asset class.
                    </Text>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <AssetClassPie />
                  </Col>
                </Row>
              </Card>
            </div>
            <div>
              <Card title="Detail" bordered={false}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Text type="secondary">
                      A detailed overview of yout investments.
                    </Text>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <DetailPie />
                  </Col>
                </Row>
              </Card>
              <br />
            </div>
          </Carousel>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Deposit calculator" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text type="secondary">
                  Set your goal and see how it affects your portfolio.
                </Text>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col md={24} lg={16}>
                <CalculatorTable />
              </Col>
              <Col md={24} lg={8}>
                <CalculatorPie />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </FadeIn>
  );
};

export default Home;
