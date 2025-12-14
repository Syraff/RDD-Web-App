import api from "@/api/api";
import { useNavigate } from "react-router";

export async function checkStatus() {
  const token = localStorage.getItem("auth_token");
  const navigate = useNavigate();

  if (!token) {
    throw navigate("/login");
  }

  try {
    const { data } = await api.get("/auth/status");
    localStorage.setItem("name", data.name);
    localStorage.setItem("role", data.role);
    return;
  } catch (err) {
    localStorage.clear();
    api.get("/auth/logout");
    throw navigate("/login");
  }
}
