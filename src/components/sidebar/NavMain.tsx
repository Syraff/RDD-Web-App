"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";
import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { Link, useLocation } from "react-router";
import type { TablerIcon } from "@tabler/icons-react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon | TablerIcon;
    level: string[];
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Accordion collapsible type="single">
          {items.map((item) => (
            <>
              {item.items?.length ? (
                <AccordionItem
                  className="relative mb-2 text-primary font-medium p-0 border-none"
                  value={item.title}
                >
                  <AccordionTrigger className="flex justify-between items-center p-0 hover:underline relative hover:bg-primary/20 ">
                    <div className="flex items-center rounded transition ">
                      <div className="relative overflow-hidden w-10 h-10 rounded mr-2 flex items-center justify-center text-gray-800 transition">
                        <div className="relative z-3">
                          <item.icon size={20} />
                        </div>
                      </div>
                      <div className="text-sm transition">{item.title}</div>
                    </div>
                    <div className="px-2">
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.items?.map((sub) => (
                      <Link to={sub.url}>
                        <div
                          className="group/sb pl-10 py-0.5 relative cursor-pointer"
                          key={sub.title}
                        >
                          <div className="absolute left-5 w-0.5 -ml-px top-0 bottom-0 bg-gray-200 group-hover/sb:bg-primary"></div>
                          <div className="pl-4">
                            <div className="block py-2 px-3 rounded hover:underline hover:bg-primary/20 text-sm hover:text-primary">
                              {sub.title}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <Link
                  to={item.url}
                  className={`group/t flex items-center rounded transition hover:bg-primary/20 ${
                    pathname.split("/")[1] === item.url.split("/")[1]
                      ? "bg-primary hover:bg-primary/90 text-white underline"
                      : ""
                  }`}
                >
                  <div className="relative overflow-hidden w-10 h-10 rounded mr-2 flex items-center justify-center text-gray-800 transition">
                    <div className="relative z-3">
                      <item.icon
                        size={20}
                        className={`${
                          pathname.split("/")[1] === item.url.split("/")[1]
                            ? " text-white"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                  <div className="text-sm transition group-hover/t:underline">
                    {item.title}
                  </div>
                </Link>
              )}
            </>
          ))}
        </Accordion>
      </SidebarMenu>
    </SidebarGroup>
  );
}
