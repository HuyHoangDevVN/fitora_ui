import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <ClipLoader color="#FF4770" size={50} />
      <p className="text-primary mt-4 text-lg font-semibold">Đang tải...</p>
    </div>
  );
};

export default Loading;
