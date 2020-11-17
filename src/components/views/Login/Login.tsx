import "../../common/Logo/Logo.css";

import { Button, Col, Input, Row, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../common/Logo/logo.svg";
import React from "react";
import { login as loginValidator } from "../../../validators/User";
import useLogin from "../../../hooks/useLogin";
import useScreenEnter from "../../../hooks/useScreenEnter";
import { yupResolver } from "@hookform/resolvers";

const { Title, Text } = Typography;

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { handleSubmit, errors, reset, control } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginValidator),
  });
  const [animation, setAnimation] = React.useState("");
  const [serverError, setServerError] = React.useState("");
  const loginUser = useLogin();
  const ref = React.createRef<SVGSVGElement>();

  useScreenEnter(ref, () => {
    setTimeout(() => {
      setAnimation("active");
    }, 200);
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await loginUser(data, "/");
      reset();
    } catch (error) {
      setServerError(!!error.message ? error.message : "");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row justify="center" align="middle">
        <Col xs={16}>
          <Logo className={animation} style={{ width: "100%" }} ref={ref} />
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Col xs={24}>
          <Title level={2} style={{ textAlign: "center" }}>
            Welcome
          </Title>
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Col xs={24}>
          <Controller
            as={
              <Input
                prefix={<UserOutlined />}
                type="text"
                placeholder="Email or username"
                autoFocus={true}
              />
            }
            name="email"
            control={control}
          />

          <Text type="danger">{errors.email?.message}</Text>
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Col xs={24}>
          <Controller
            as={
              <Input.Password
                prefix={<LockOutlined />}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                type="password"
                placeholder="Password"
              />
            }
            name="password"
            control={control}
          />

          <Text type="danger">{errors.password?.message}</Text>
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Text type="danger">{serverError}</Text>
      </Row>
      <Row gutter={[0, 24]}>
        <Col xs={24}>
          <Link to="/forgot">Forgot your username or password?</Link>
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%" }}
          size="large"
        >
          Log in
        </Button>
      </Row>
      <Row gutter={[0, 24]}>
        <Col xs={24}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </Col>
      </Row>
    </form>
  );
};

export default Login;
