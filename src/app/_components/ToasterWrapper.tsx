"use client";

import React from "react";
import { ToastContainer, type ToastContainerProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const options: ToastContainerProps = {
  autoClose: 5000,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  limit: 5,
  closeOnClick: true,
  role: "alert",
  theme: "dark",
  position: "bottom-right",
};

export default function ToasterWrapper() {
  return (
    <>
      <ToastContainer containerId={"globalToastContainer"} {...options} />
    </>
  );
}
