import { Suspense, ComponentType } from "react";
import LoadingFallback from "@/components/common/LoadingFallback";

export const withSuspense = (
  Component: ComponentType,
  loadingMessage?: string
) => (
  <Suspense fallback={<LoadingFallback message={loadingMessage} />}>
    <Component />
  </Suspense>
);

export const withLayoutAndSuspense = (
  Component: ComponentType,
  Layout: ComponentType<{ children: React.ReactNode }>,
  loadingMessage?: string
) => (
  <Suspense fallback={<LoadingFallback message={loadingMessage} />}>
    <Layout>
      <Component />
    </Layout>
  </Suspense>
);

export interface RouteConfig {
  path: string;
  element: JSX.Element;
  children?: RouteConfig[];
}

export const createRoute = (
  path: string,
  element: JSX.Element,
  children?: RouteConfig[]
): RouteConfig => ({
  path,
  element,
  children,
});
