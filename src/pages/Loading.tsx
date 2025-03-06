import { useEffect, useState } from "react";

const Loading = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setTimeout(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : "."));
    }, 500);
    return () => clearTimeout(interval);
  }, [dots]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-green-500 bg-animate">
      <div className="w-12 h-12 border-4 border-white rounded-full animate-spin"></div>
      <p className="text-white mt-4">Loading{dots}</p>
    </div>
  );
};

export default Loading;
