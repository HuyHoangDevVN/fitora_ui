import { Suspense, ComponentType, ReactNode, lazy } from "react";
import LoadingFallback from "@/components/common/LoadingFallback";

interface RouteElementOptions {
  loadingMessage?: string;
  Layout?: ComponentType<{ children: ReactNode }>;
}

export const createLazyRoute = (
  importFunc: () => Promise<{ default: ComponentType }>,
  options: RouteElementOptions = {}
) => {
  const { loadingMessage, Layout } = options;
  const LazyComponent = lazy(importFunc);

  return (
    <Suspense fallback={<LoadingFallback message={loadingMessage} />}>
      {Layout ? (
        <Layout>
          <LazyComponent />
        </Layout>
      ) : (
        <LazyComponent />
      )}
    </Suspense>
  );
};
