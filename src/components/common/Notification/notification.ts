import React from "react";
import { notification } from "antd";

interface message {
  message: React.ReactNode;
  description: React.ReactNode;
}

export const notificationInfo = (config: message) => {
  return notification.info(config);
};

export const notificationWarning = (config: message) => {
  return notification.warning(config);
};

export const notificationError = (config: message) => {
  return notification.error(config);
};

export const notificationSuccess = (config: message) => {
  return notification.success(config);
};
