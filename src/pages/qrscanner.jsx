import React, { useState, useEffect } from "react";
import ReactQRScanner from "react-qr-scanner";
import axios from "axios";

const QRScanner = () => {
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setResult(data.text);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  useEffect(() => {
    if (result) {
      sendQRDataToServer(result);
    }
  }, [result]);

  const sendQRDataToServer = async (qrData) => {
    try {
      const response = await axios.post(
        "https://welcomekitbe.lion.it.kr/api/attendance/success",
        {
          qrData,
        }
      );

      setMessage(`서버 응답: ${response.data.message}`);
    } catch (error) {
      console.error("서버 요청 실패:", error);
      setMessage("서버 요청 실패");
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
    </div>
  );
};

export default QRScanner;
