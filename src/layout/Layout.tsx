import { AppSidebar } from "@/components/sidebar/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { Outlet, useLocation, useParams } from "react-router";

export default function Layout() {
  const { pathname } = useLocation();
  const { id } = useParams();
  const [name] = useState("");
  // const navigate = useNavigate();
  // const userId = localStorage.getItem("userId");

  // const checkStatus = async () => {
  //   try {
  //     const { data } = await api.get("/auth/status");
  //     localStorage.setItem("name", data.name);
  //     localStorage.setItem("role", data.role);
  //     localStorage.setItem("userId", data.userId);
  //     return;
  //   } catch (err) {
  //     console.log(err);
  //     localStorage.clear();
  //     api.get("/auth/logout");
  //     throw navigate("/login");
  //   }
  // };

  // const getDataParam = async () => {
  //   try {
  //     if (!id) return;

  //     const { data } = await api.get("/olimpiade/" + id);
  //     setName(data.name + " | " + data.kelas);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   checkStatus();

  //   const intervalId = setInterval(checkStatus, 5000);

  //   return () => clearInterval(intervalId);
  // }, []);

  // useEffect(() => {
  //   getDataParam();
  // }, [id]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {pathname.split("/").map((path, index) => (
                  <>
                    <BreadcrumbItem className="">
                      {index !== pathname.split("/").length - 1 ? (
                        <BreadcrumbItem className="capitalize">
                          {path}
                        </BreadcrumbItem>
                      ) : (
                        <BreadcrumbPage className="capitalize">
                          {id ? name : path}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index > 0 && index !== pathname.split("/").length - 1 && (
                      <BreadcrumbSeparator className="" />
                    )}
                  </>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
