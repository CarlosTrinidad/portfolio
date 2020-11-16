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
import { create as createUserValidator } from "../../../validators/User";
import useRegister from "../../../hooks/useRegister";
import useScreenEnter from "../../../hooks/useScreenEnter";
import { yupResolver } from "@hookform/resolvers";

const { Title, Text } = Typography;

interface CreateForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { handleSubmit, errors, reset, control } = useForm<CreateForm>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(createUserValidator),
  });
  
  const [serverError, setServerError] = React.useState("");
  const [animation, setAnimation] = React.useState("");
  const createUser = useRegister();

  const ref = React.createRef<SVGSVGElement>();

  useScreenEnter(ref, () => {
    setTimeout(() => {
      setAnimation("active");
    }, 200);
  });
  const onSubmit = async (data: CreateForm) => {
    try {
      await createUser(data);
      reset();
    } catch (error) {
      setServerError(!!error.message ? error.message : "");
    }
  };

  return (
    <form>
      <Row justify="center" align="middle">
        <Col xs={16}>
          <Logo className={animation} style={{ width: "100%" }} ref={ref} />
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Col xs={24}>
          <Title level={2} style={{ textAlign: "center" }}>
            Create an account
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
        <Col xs={24}>
          <Controller
            as={
              <Input.Password
                prefix={<LockOutlined />}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                type="password"
                placeholder="Confirm password"
              />
            }
            name="confirmPassword"
            control={control}
          />

          <Text type="danger">{errors.confirmPassword?.message}</Text>
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Text type="danger">{serverError}</Text>
      </Row>
      <Row gutter={[0, 24]}>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%" }}
          size="large"
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </Button>
      </Row>
      <Row gutter={[0, 24]}>
        <Col xs={24}>
          Have an account? <Link to="/login">Sign in</Link>
        </Col>
      </Row>
    </form>
  );
};

export default Register;
