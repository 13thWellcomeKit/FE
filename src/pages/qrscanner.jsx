import React, { useState } from 'react';
import ReactQRScanner from 'react-qr-scanner';

const QRScanner = () => {
  const [result, setResult] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setResult(data.text);
    }
  };

  const handleError = (err) => {
    console.error(err);
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
