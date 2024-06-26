import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Preview from "./pages/Preview/Preview.jsx";

import { useInitFromLocalStorage } from "./handkey-module/state.js";

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
]);

function Wrapper({ children }) {
  useInitFromLocalStorage();
  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <React.Suspense fallback={<p>loading</p>}>
        <Wrapper>
          <RouterProvider router={router} />
        </Wrapper>
      </React.Suspense>
    </RecoilRoot>
  </React.StrictMode>,
);
