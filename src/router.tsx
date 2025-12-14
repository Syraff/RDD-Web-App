import { createBrowserRouter, redirect } from "react-router";
import Login from "./pages/auth/Login";
import Layout from "./layout/Layout";
import ToolsPage from "./pages/admin/ToolsPage";

export const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <LayoutPeserta />,
  //   loader: async () => {
  //     const token = localStorage.getItem("auth_token");
  //     const role = localStorage.getItem("role");
  //     if (token) {
  //       if (role === "ADMIN") {
  //         throw redirect("/admin/dashboard");
  //       }
  //     } else {
  //       throw redirect("/login");
  //     }
  //   },
  //   children: [
  //     {
  //       path: "/",
  //       element: <PesertaPage />,
  //     },
  //     {
  //       path: "/exam",
  //       element: <ExamPeserta />,
  //     },
  //   ],
  // },
  {
    path: "/",
    element: <Layout />,
    loader: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw redirect("/login");
      }
      return null;
    },
    children: [
      // Dashboard
      {
        path: "/demo",
        element: <ToolsPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    loader: () => {
      const token = localStorage.getItem("token");
      // const role = localStorage.getItem("role");
      if (token) {
        throw redirect("/demo");
      }
      return null;
    },
  },
]);
