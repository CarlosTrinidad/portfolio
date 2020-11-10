import "../../common/Logo/Logo.css";

import { Button, Col, Input, Row, Typography } from "antd";

import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../common/Logo/logo.svg";
import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { forgotPassword } from "../../../validators/User";
import { useForm } from "react-hook-form";
import useScreenEnter from "../../../hooks/useScreenEnter";
import useSendPasswordEmail from "../../../hooks/useSendResetPasswordEmail";
import { yupResolver } from "@hookform/resolvers";

const { Title, Text } = Typography;

interface ForgotPasswordForm {
  email: string;
}

const RecoverPassword: React.FC = () => {
  const { register, handleSubmit, errors, reset } = useForm<ForgotPasswordForm>(
    {
      resolver: yupResolver(forgotPassword),
    }
  );
  const [animation, setAnimation] = React.useState("");
  const ref = React.createRef<SVGSVGElement>();

  const sendRecoverEmail = useSendPasswordEmail();
  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      let authData = await sendRecoverEmail(data.email);
      console.log("Mail sended", authData);
      reset({
        email: "",
      });
    } catch (error) {
      console.log("Mail Failed!", error);
    }
  };
  useScreenEnter(ref, () => {
    setTimeout(() => {
      setAnimation("active");
    }, 200);
  });

  if (false) {
    return (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="text" name="email" ref={register} />
          <p>{errors.email?.message}</p>
          <button type="submit">Send</button>
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
            Forgot your password?
          </Title>
          <Text type="secondary">
            Enter the email address that you registered with us and we will send
            you further instructions.
          </Text>
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
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%" }}
          size="large"
          onClick={handleSubmit(onSubmit)}
        >
          Continue
        </Button>
      </Row>
      <Row gutter={[0, 36]} justify="center" align="middle">
        <Col xs={24}>
          <Link to="/login">Go back</Link>
        </Col>
      </Row>
    </form>
  );
};

export default RecoverPassword;
