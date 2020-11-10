import "../../common/Logo/Logo.css";

import { Button, Col, Input, Row, Typography } from "antd";
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
import { useForm } from "react-hook-form";
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
  const { register, handleSubmit, errors, reset } = useForm<CreateForm>({
    resolver: yupResolver(createUserValidator),
  });
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
      let authData = await createUser(data);
      console.log("User created successfully with payload-", authData);
      reset({
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.log("Login Failed!", error);
    }
  };
  if (false) {
    return (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Email</label>
          <input type="text" name="email" ref={register} />
          <p>{errors.email?.message}</p>

          <label>Password</label>
          <input type="password" name="password" ref={register} />
          <p>{errors.password?.message}</p>

          <label>Confirm password</label>
          <input type="password" name="confirmPassword" ref={register} />
          <p>{errors.confirmPassword?.message}</p>

          <button type="submit">Ingresar</button>
        </form>
      </div>
    );
  }
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
          <Input
            prefix={<UserOutlined />}
            type="text"
            name="email"
            placeholder="Email or username"
            autoFocus={true}
            ref={register}
          />
          <Text type="danger">{errors.email?.message}</Text>
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Col xs={24}>
          <Input.Password
            prefix={<LockOutlined />}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            type="password"
            name="password"
            placeholder="Password"
            ref={register}
          />
          <Text type="danger">{errors.password?.message}</Text>
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Col xs={24}>
          <Input.Password
            prefix={<LockOutlined />}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            ref={register}
          />
          <Text type="danger">{errors.confirmPassword?.message}</Text>
        </Col>
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
