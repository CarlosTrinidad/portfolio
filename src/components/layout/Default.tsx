import {
  Avatar,
  Button,
  Col,
  Drawer,
  Dropdown,
  Grid,
  Layout,
  Menu,
  Row,
  Typography,
} from "antd";
import { Link, NavLink, useLocation, withRouter } from "react-router-dom";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { ReactComponent as Logo } from "../../components/common/Logo/logo.svg";
import React from "react";
import useLogout from "../../hooks/useLogout";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const Default: React.FC = ({ children }) => {
  let location = useLocation();
  const logout = useLogout();
  const handleLogout = React.useCallback(() => logout(), [logout]);
  const [xs, setXS] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const screens = useBreakpoint();

  console.log("🚀 ~ file: Default.tsx ~ line 27 ~ screens", screens);

  const collapseDrawer = React.useCallback(() => {
    setCollapsed(false);
  }, []);
  const expandDrawer = React.useCallback(() => {
    setCollapsed(true);
  }, []);

  React.useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (screens.hasOwnProperty("xs")) {
        setXS(!!screens.xs);
      }
    }
    return () => {
      mounted = false;
    };
  }, [screens]);

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
          {xs && (
            <Col>
              <div style={{ margin: "0 1.5em" }}>
                <Button
                  type="primary"
                  onClick={expandDrawer}
                  style={{ marginBottom: 16 }}
                >
                  <MenuFoldOutlined />
                </Button>
              </div>
            </Col>
          )}

          {!xs && (
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
                <Menu.Item key="/shares" style={{ marginTop: "-2px" }}>
                  <NavLink to="/shares">Shares</NavLink>
                </Menu.Item>
                <Menu.Item key="/bonds" style={{ marginTop: "-2px" }}>
                  <NavLink to="/bonds">Bonds</NavLink>
                </Menu.Item>
                <Menu.Item key="/emergency-fund" style={{ marginTop: "-2px" }}>
                  <NavLink to="/emergency-fund">Emergency fund</NavLink>
                </Menu.Item>
                <Menu.Item key="account" style={{ marginTop: "-2px" }}>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item danger onClick={handleLogout}>
                          Log out
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <Avatar icon={<UserOutlined />} />
                  </Dropdown>
                </Menu.Item>
              </Menu>
            </Col>
          )}
        </Row>
      </Header>
      <Drawer
        title="Menu"
        placement="left"
        closable={true}
        onClose={collapseDrawer}
        visible={collapsed}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["/"]}
          selectedKeys={[location.pathname]}
          style={{ background: "transparent", borderBottom: "0px" }}
        >
          <Menu.Item
            key="/"
            style={{ marginTop: "-2px" }}
            onClick={collapseDrawer}
          >
            <NavLink to="/">Dashboard</NavLink>
          </Menu.Item>
          <Menu.Item
            key="/shares"
            style={{ marginTop: "-2px" }}
            onClick={collapseDrawer}
          >
            <NavLink to="/shares">Shares</NavLink>
          </Menu.Item>
          <Menu.Item
            key="/bonds"
            style={{ marginTop: "-2px" }}
            onClick={collapseDrawer}
          >
            <NavLink to="/bonds">Bonds</NavLink>
          </Menu.Item>
          <Menu.Item
            key="/emergency-fund"
            style={{ marginTop: "-2px" }}
            onClick={collapseDrawer}
          >
            <NavLink to="/emergency-fund">Emergency fund</NavLink>
          </Menu.Item>
          <Menu.Item
            key="account"
            style={{ marginTop: "-2px" }}
            danger
            onClick={handleLogout}
          >
            Log out <LogoutOutlined />
          </Menu.Item>
        </Menu>
      </Drawer>
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
