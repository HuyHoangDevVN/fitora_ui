import Layout from "@layouts/MainLayout";
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import hoặc Lazy-load các Page
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="about"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <About />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
