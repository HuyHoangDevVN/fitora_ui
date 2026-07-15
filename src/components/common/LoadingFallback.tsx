import { Spin } from "antd";
import { memo } from "react";

interface LoadingFallbackProps {
  message?: string;
}

const LoadingFallback = memo(
  ({ message = "Loading..." }: LoadingFallbackProps) => (
    <div className="flex items-center justify-center min-h-screen">
      <Spin size="large" tip={message} />
    </div>
  )
);

LoadingFallback.displayName = "LoadingFallback";

export default LoadingFallback;
