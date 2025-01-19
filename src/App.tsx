import * as React from "react";
import { HashRouter, Route, Routes } from "react-router";
import * as ReactDOM from "react-dom/client";
import Layout from "./layouts/dashboard";
import HomePage from "./pages";
import OrdersPage from "./pages/orders";

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
