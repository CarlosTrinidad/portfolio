import { Col, Layout, Menu, Row, Typography } from "antd";
import { Link, NavLink, useLocation, withRouter } from "react-router-dom";

import { ReactComponent as Logo } from "../../components/common/Logo/logo.svg";
import React from "react";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const Default: React.FC = ({ children }) => {
  let location = useLocation();

  return (
    <Layout>
      <Header
        style={{ position: "fixed", zIndex: 1, width: "100%", padding: "0" }}
      >
        <Row justify="space-between">
          <Col>
            <Link to="/">
              <Logo
                style={{
                  width: "120px",
                  height: "31px",
                  margin: "16px 15px",
                  float: "left",
                }}
                className="active"
              />
            </Link>
          </Col>
          <Col>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={["/"]}
              selectedKeys={[location.pathname]}
              style={{ background: "transparent", borderBottom: "0px" }}
            >
              <Menu.Item key="/" style={{ marginTop: "-2px" }}>
                <NavLink to="/">Dashboard</NavLink>
              </Menu.Item>
              <Menu.Item key="/variable" style={{ marginTop: "-2px" }}>
                <NavLink to="/variable">Variable</NavLink>
              </Menu.Item>
              <Menu.Item key="/fixed" style={{ marginTop: "-2px" }}>
                <NavLink to="/fixed">Fixed</NavLink>
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Header>
      <Content
        className="site-layout"
        style={{
          padding: "1em 1.5em",
          marginTop: 64,
          minHeight: "calc(100vh - 64px - 48px - 20px)",
        }}
      >
        {children}
      </Content>
      <Footer style={{ textAlign: "center" }}>
        <Text type="secondary">
          Investment Portfolio, ©Copyright {new Date().getFullYear()}
        </Text>
      </Footer>
    </Layout>
  );
};

export default withRouter(Default);
