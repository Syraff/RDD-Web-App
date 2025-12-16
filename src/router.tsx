import { createBrowserRouter, redirect } from "react-router";
import Login from "./pages/auth/Login";
import Layout from "./layout/Layout";
import MonitorPage from "./pages/admin/monitor/MonitorPage";
import MonitorDetail from "./pages/admin/monitor/MonitorDetail";
import DashboardDriver from "./pages/driver/DashboardDriver";

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
    loader: async ({ request }) => {
      const token = localStorage.getItem("token");
      const url = new URL(request.url);

      if (!token) {
        throw redirect("/login");
      }

      if (url.pathname === "/") {
        throw redirect("/monitor");
      }
      return null;
    },
    children: [
      {
        path: "/monitor",
        loader: async () => {
          const role = localStorage.getItem("role");
          if (role === "driver") {
            throw redirect("/dashboard");
          }
          return null;
        },
        children: [
          { index: true, element: <MonitorPage /> },
          { path: ":id", element: <MonitorDetail /> },
        ],
      },
      {
        path: "/dashboard",
        loader: async () => {
          const role = localStorage.getItem("role");
          if (role !== "driver") {
            throw redirect("/monitor");
          }
          return null;
        },
        children: [{ index: true, element: <DashboardDriver /> }],
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
        throw redirect("/monitor");
      }
      return null;
    },
  },
]);
