import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Preview from "./pages/Preview/Preview.jsx";
import Employee from "./pages/Employee/Employee.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/preview",
    element: <Preview />,
  },
  {
    path: "/employee",
    element: <Employee />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <React.Suspense fallback={<p>loading</p>}>
        <RouterProvider router={router} />
      </React.Suspense>
    </RecoilRoot>
  </React.StrictMode>,
);
