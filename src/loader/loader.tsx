import React from "react";
import "./Loader.scss";

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="atom">
        <div className="electron"></div>
        <div className="electron-alpha"></div>
        <div className="electron-omega"></div>
      </div>
    </div>
  );
};

export default Loader;
