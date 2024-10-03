import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Signup from "../page/Signup";
import Home from "../page/Home";
import Layout from "../components/shared/Layout";
// import Login from "../page/Login";

const route = createBrowserRouter([
  { path: "/", Component: Layout, children: [{ path: "/", Component: Home }] },
]);

const Router: React.FC = () => {
  return <RouterProvider router={route} />;
};

export default Router;
