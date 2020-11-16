import "../../common/Logo/Logo.css";

import { Button, Col, Input, Modal, Row, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";

import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../common/Logo/logo.svg";
import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { forgotPassword } from "../../../validators/User";
import useScreenEnter from "../../../hooks/useScreenEnter";
import useSendPasswordEmail from "../../../hooks/useSendResetPasswordEmail";
import { yupResolver } from "@hookform/resolvers";

const { Title, Text, Paragraph } = Typography;

interface ForgotPasswordForm {
  email: string;
}

const RecoverPassword: React.FC = () => {
  const { handleSubmit, errors, reset, control } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(forgotPassword),
  });
  const [animation, setAnimation] = React.useState("");
  const [serverError, setServerError] = React.useState("");

  const ref = React.createRef<SVGSVGElement>();

  const sendRecoverEmail = useSendPasswordEmail();
  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await sendRecoverEmail(data.email);

      Modal.info({
        title: "Mail sended :)",
        content: (
          <Typography>
            <Paragraph>
              An email with instructions was sent to{" "}
              <Text strong>{data.email}.</Text> If you have yet received an
              email, follow these steps:
            </Paragraph>
            <Paragraph>
              <ol>
                <li>
                  Wait. It can take a few minutes for the email to be delivered
                </li>
                <li>Check your spam folder and filters</li>
                <li>
                  Click <Typography.Link href="/forgot">here</Typography.Link>{" "}
                  to retype and submit your email.
                </li>
              </ol>
            </Paragraph>
          </Typography>
        ),
        onOk() {},
      });

      reset();
      setServerError("");
    } catch (error) {
      setServerError(!!error.message ? error.message : "");
    }
  };
  useScreenEnter(ref, () => {
    setTimeout(() => {
      setAnimation("active");
    }, 200);
  });

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
          <Controller
            name="email"
            control={control}
            as={
              <Input
                prefix={<UserOutlined />}
                type="text"
                placeholder="Email or username"
                autoFocus={true}
              />
            }
          />
          <Text type="danger">{errors.email?.message}</Text>
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Text type="danger">{serverError}</Text>
      </Row>
      <Row gutter={[0, 24]}>
        <Col xs={24}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            size="large"
            onClick={handleSubmit(onSubmit)}
          >
            Continue
          </Button>
        </Col>
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
