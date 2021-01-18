import "./Home.css";

import { Card, Carousel, Col, Row, Spin, Typography } from "antd";

import AssetClassPie from "./AssetClassPie";
import CalculatorPie from "./CalculatorPie";
import CalculatorTable from "./CalculatorTable";
import DetailPie from "./DetailPie";
import FadeIn from "react-fade-in";
import GeneralPie from "./GeneralPie";
import React from "react";
import { notificationError } from "../../common/Notification/notification";
import useAssetsContext from "../../../store/assets";
import { useCryptosActions } from "../../../hooks/useCryptos";
import useCurrencyExchange from "../../../hooks/useCurrencyExchange";
import { useFixedActions } from "../../../hooks/useFixed";
import useMarketQuotes from "../../../hooks/useMarketQuotes";
import useUser from "../../../hooks/useUser";
import { useVariableActions } from "../../../hooks/useVariable";

const selectorCustom = (state: any) => state.setCustom;
const selectorOriginal = (state: any) => state.setOriginal;

const { Text } = Typography;
const Home: React.FC = () => {
  const user = useUser();
  const exchanger = useCurrencyExchange();
  const setCustom = useAssetsContext(selectorCustom);
  const setOriginal = useAssetsContext(selectorOriginal);
  const [groupBySymbol, setGroupBySymbol] = React.useState<any>({});
  const [groupByBond, setGroupByBond] = React.useState<any>({});
  const [groupByCrypto, setGroupByCrypto] = React.useState<any>({});
  const [totalVariable, setTotalVariable] = React.useState(0);
  const [totalFixed, setTotalFixed] = React.useState(0);
  const [totalCryptos, setTotalCryptos] = React.useState(0);
  const [generalLoading, setGeneralLoading] = React.useState(true);
  const [general, setGeneral] = React.useState<any>([]);
  const [detailLoading, setDetailLoading] = React.useState(true);
  const [detail, setDetail] = React.useState<any>([]);
  const [assetClassesLoading, setAssetClassesLoading] = React.useState(true);

  const variableActions = useVariableActions();
  const fixedActions = useFixedActions();
  const cryptosActions = useCryptosActions();
  const [quoteInfo] = useMarketQuotes();

  const getVariable = React.useCallback(async () => {
    if (user === null) {
      return;
    }
    if (!user.uid) {
      return;
    }

    try {
      let result = await variableActions.get(user.uid);
      if (result !== undefined && !result.empty) {
        let agregated: any = {};

        let total = 0;
        result.forEach((result) => {
          let item = result.data();
          let marketPrice = 0;

          if (quoteInfo.hasOwnProperty(item.symbol)) {
            marketPrice = quoteInfo[item.symbol].regularMarketPrice
              ? quoteInfo[item.symbol].regularMarketPrice
              : 0;
          }
          if (!agregated.hasOwnProperty(item.symbol)) {
            agregated[item.symbol] = {
              name: item.symbol,
              totalPrice: item.shares * marketPrice,
              assetClass: item.assetClass,
            };
          } else {
            agregated[item.symbol]["totalPrice"] += item.shares * marketPrice;
          }
          total += item.shares * marketPrice;
        });
        setTotalVariable(total);
        setGroupBySymbol(agregated);
      }
    } catch (error) {
      setTotalVariable(0);
      setGroupBySymbol({});
      notificationError({
        message: "Error :(",
        description: error.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getFixed = React.useCallback(async () => {
    if (user === null) {
      return;
    }
    if (!user.uid) {
      return;
    }

    try {
      let result = await fixedActions.get(user.uid);
      if (result !== undefined && !result.empty) {
        let total = 0;
        let grouped: any = {};
        result.forEach((result) => {
          let item = result.data();
          let key = item.name.replace(/ /g, "");
          if (!grouped.hasOwnProperty(key)) {
            grouped[key] = {
              name: item.name,
              amount: item.amount,
              assetClass: item.assetClass,
            };
          } else {
            grouped[key]["amount"] += item.amount;
          }

          total += item.amount;
        });
        setTotalFixed(total);
        setGroupByBond(grouped);
      }
    } catch (error) {
      setTotalFixed(0);
      notificationError({
        message: "Error :(",
        description: error.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getCryptos = React.useCallback(async () => {
    if (user === null) {
      return;
    }
    if (!user.uid) {
      return;
    }

    try {
      let result = await cryptosActions.get(user.uid);
      if (result !== undefined && !result.empty) {
        let total = 0;
        let grouped: any = {};

        result.forEach((result) => {
          let item = result.data();
          if (!grouped.hasOwnProperty(item.symbol)) {
            grouped[item.symbol] = {
              name: item.symbol,
              assetClass: item.assetClass,
              totalPrice: 0,
              amount: item.amount,
            };
          }else {
            grouped[item.symbol]["amount"] += item.amount;
          }
        });

        for (const symbol of Object.keys(grouped)) {
          let marketPrice = 0;
          let currencyResponse = await exchanger({
            from: symbol.toUpperCase(),
            to: "MXN",
            q: "1",
          });

          if (currencyResponse) {
            marketPrice = currencyResponse ? currencyResponse : 0;
          }
          grouped[symbol]["totalPrice"] += grouped[symbol].amount * marketPrice;
          total += grouped[symbol].amount * marketPrice;
        }
        setTotalCryptos(total);
        setGroupByCrypto(grouped);
      }
    } catch (error) {
      setTotalCryptos(0);
      notificationError({
        message: "Error :(",
        description: error.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, exchanger]);

  React.useEffect(() => {
    let mounted = true;

    if (mounted) {
      getFixed();
      getVariable();
      getCryptos();
    }

    return () => {
      mounted = false;
    };
  }, [getFixed, getVariable, getCryptos]);

  React.useEffect(() => {
    let mounted = true;

    if (mounted) {
      let total = totalVariable + totalFixed + totalCryptos;
      if (total > 0) {
        setGeneral([
          {
            type: "Shares",
            value: (totalVariable / total) * 100,
          },
          {
            type: "Bonds",
            value: (totalFixed / total) * 100,
          },
          {
            type: "Cryptos",
            value: (totalCryptos / total) * 100,
          },
        ]);
      } else {
        setGeneral([]);
      }
      setGeneralLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [totalVariable, totalFixed, totalCryptos]);

  React.useEffect(() => {
    let mounted = true;

    if (mounted) {
      setDetailLoading(true);
      let detail = [];
      let total = totalVariable + totalFixed + totalCryptos;
      if (total > 0) {
        for (const symbol in groupBySymbol) {
          if (groupBySymbol.hasOwnProperty(symbol)) {
            const element = groupBySymbol[symbol];
            detail.push({
              type: element.name,
              value: (element.totalPrice / total) * 100,
              amount: element.totalPrice,
            });
          }
        }

        for (const symbol in groupByCrypto) {
          if (groupByCrypto.hasOwnProperty(symbol)) {
            const element = groupByCrypto[symbol];
            detail.push({
              type: element.name,
              value: (element.totalPrice / total) * 100,
              amount: element.totalPrice,
            });
          }
        }

        for (const key in groupByBond) {
          if (groupByBond.hasOwnProperty(key)) {
            const element = groupByBond[key];
            detail.push({
              type: element.name,
              value: (element.amount / total) * 100,
              amount: element.amount,
            });
          }
        }
      }

      if (detail.length > 0) {
        setDetail(detail);
      } else {
        setDetail([]);
      }
      setDetailLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [
    groupBySymbol,
    groupByBond,
    groupByCrypto,
    totalFixed,
    totalVariable,
    totalCryptos,
  ]);

  React.useEffect(() => {
    let mounted = true;
    const empty = {
      amount: 0,
      weights: 0,
      gainLoss: 0,
    };

    if (mounted) {
      setAssetClassesLoading(true);
      let byClass: any = {
        USEquities: {
          ...empty,
          id: "USEquities",
          assetClass: "US Equities",
        },
        MoneyMarket: {
          ...empty,
          id: "MoneyMarket",
          assetClass: "Money Market",
        },
        RealEstateFunds: {
          ...empty,
          id: "RealEstateFunds",
          assetClass: "Real Estate Funds",
        },
        DevelopingWorldInternationalEquities: {
          ...empty,
          id: "DevelopingWorldInternationalEquities",
          assetClass: "Developing World International Equities",
        },
        GovermentBonds: {
          ...empty,
          id: "GovermentBonds",
          assetClass: "Goverment Bonds",
        },
        EmergingMarketEquities: {
          ...empty,
          id: "EmergingMarketEquities",
          assetClass: "Emerging Market Equities",
        },
        TreasuryInflationProtectedSecurities: {
          ...empty,
          id: "TreasuryInflationProtectedSecurities",
          assetClass: "Treasury Inflation Protected Securities",
        },
        Cryptocurrencies: {
          ...empty,
          id: "Cryptocurrencies",
          assetClass: "Cryptocurrencies",
        },
        Other: {
          ...empty,
          id: "Other",
          assetClass: "Other",
        },
      };
      let grouped: any = [];
      let grouped2: any = [];
      let total = totalVariable + totalFixed + totalCryptos;
      if (total > 0) {
        for (const symbol in groupBySymbol) {
          if (groupBySymbol.hasOwnProperty(symbol)) {
            const element = groupBySymbol[symbol];
            let key = element.assetClass.replace(/ /g, "");
            if (!byClass.hasOwnProperty(key)) {
              byClass[key] = {
                assetClass: element.assetClass,
                amount: element.totalPrice,
              };
            } else {
              byClass[key]["amount"] += element.totalPrice;
            }
          }
        }

        for (const symbol in groupByCrypto) {
          if (groupByCrypto.hasOwnProperty(symbol)) {
            const element = groupByCrypto[symbol];
            let key = element.assetClass.replace(/ /g, "");
            if (!byClass.hasOwnProperty(key)) {
              byClass[key] = {
                assetClass: element.assetClass,
                amount: element.totalPrice,
              };
            } else {
              byClass[key]["amount"] += element.totalPrice;
            }
          }
        }

        for (const key in groupByBond) {
          if (groupByBond.hasOwnProperty(key)) {
            const element = groupByBond[key];

            let idKey = element.assetClass.replace(/ /g, "");
            if (!byClass.hasOwnProperty(idKey)) {
              byClass[idKey] = {
                assetClass: element.assetClass,
                amount: element.amount,
              };
            } else {
              byClass[idKey]["amount"] += element.amount;
            }
          }
        }

        for (const key in byClass) {
          if (byClass.hasOwnProperty(key)) {
            const element = byClass[key];
            let item = {
              id: key,
              assetClass: element.assetClass,
              amount: element.amount,
              weights: +((element.amount / total) * 100).toFixed(2),
              gainLoss: 0,
            };
            grouped.push(item);
            grouped2.push({ ...item });
          }
        }
      }

      if (grouped.length > 0) {
        setOriginal([...grouped]);
        setCustom([...grouped2]);
      } else {
        setOriginal([]);
        setCustom([]);
      }
      setAssetClassesLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [
    groupByBond,
    groupBySymbol,
    groupByCrypto,
    setCustom,
    setOriginal,
    totalFixed,
    totalVariable,
    totalCryptos,
  ]);

  return (
    <FadeIn>
      <Row gutter={[16, 16]}>
        <Col lg={8} md={12} sm={0} xs={0}>
          <Spin spinning={generalLoading}>
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
                  {!generalLoading && <GeneralPie data={general} />}
                </Col>
              </Row>
            </Card>
          </Spin>
        </Col>
        <Col lg={8} md={12} sm={0} xs={0}>
          <Spin spinning={assetClassesLoading}>
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
                <Col span={24}>{!assetClassesLoading && <AssetClassPie />}</Col>
              </Row>
            </Card>
          </Spin>
        </Col>
        <Col lg={8} md={24} sm={0} xs={0}>
          <Spin spinning={detailLoading}>
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
                  {!detailLoading && <DetailPie data={detail} />}
                </Col>
              </Row>
            </Card>
          </Spin>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
          <Carousel>
            <div>
              <Spin spinning={generalLoading}>
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
                      {!generalLoading && <GeneralPie data={general} />}
                    </Col>
                  </Row>
                </Card>
              </Spin>
            </div>
            <div>
              <Spin spinning={assetClassesLoading}>
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
                      {!assetClassesLoading && <AssetClassPie />}
                    </Col>
                  </Row>
                </Card>
              </Spin>
            </div>
            <div>
              <Spin spinning={detailLoading}>
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
                      {!detailLoading && <DetailPie data={detail} />}
                    </Col>
                  </Row>
                </Card>
              </Spin>
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
