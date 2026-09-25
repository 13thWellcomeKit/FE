import React, { useState, useRef } from "react";
import ReactQRScanner from "react-qr-scanner";
import axiosInstance from "../axiosInstance";
import { errorMessage, extractQrToken } from "../attendance";

const QRScanner = () => {
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState(null);

  const handled = useRef(false);
  const handleScan = (data) => {
    if (data && !handled.current) {
      handled.current = true;
      setResult(data.text);
      sendQRDataToServer(data.text);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };


  const sendQRDataToServer = async (qrData) => {
    try {
      const response = await axiosInstance.post("/attendance/success", {
        token: extractQrToken(qrData),
      });

      setMessage(`서버 응답: ${response.data?.message ?? response.data}`);
      console.log(message);
    } catch (error) {
      console.error("서버 요청 실패:", error);
      setMessage(errorMessage(error, "서버 요청 실패"));
      console.log(message);
    }
  };

  return (
    <div>
      <h3>Scan QR Code</h3>
      <ReactQRScanner
        delay={300}
        facingMode={"environment"}
        onError={handleError}
        onScan={handleScan}
      />
      <div>{result && <p>Scanned result: {result}</p>}</div>
      <div>{message && <p>{message}</p>}</div>
    </div>
  );
};

export default QRScanner;
