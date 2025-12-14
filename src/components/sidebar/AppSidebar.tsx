"use client";

import * as React from "react";
import Logo from "@/assets/dark_logo.png";

import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Menu from "@/menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const [user, setUser] = React.useState({
    name,
    role,
    avatar: "/avatars/shadcn.jpg",
  });

  React.useEffect(() => {
    setUser({ name, role, avatar: "/avatars/shadcn.jpg" });
  }, []);
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu className="hover:bg-none">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="grid flex-1 text-left text-sm">
                  <LazyLoadImage src={Logo} className="object-fit h-auto" />
                  {/* <span className="truncate text-xs">Road Damage Detector</span> */}
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={Menu()} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
