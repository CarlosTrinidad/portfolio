import React from "react";
import { Spin } from "antd";

const Loader: React.FC = () => {
  return (
    <div
      style={{
        textAlign: "center",
        background: "rgba(0, 0, 0, 0.05)",
        borderRadius: "4px",
        marginBottom: "20px",
        padding: "30px 50px",
        margin: "20px 0",
        position: "absolute",
        top: "50%",
        left: "50%",
      }}
    >
      <Spin />
    </div>
  );
};

export default Loader;
