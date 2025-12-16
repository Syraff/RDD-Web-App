import { IconDashboard, IconDeviceComputerCamera } from "@tabler/icons-react";

export default function Menu() {
  // const role = useSelector((state: RootState) => state.user.role);

  const Items = [
    {
      title: "Monitor",
      url: `/monitor`,
      level: ["MONITOR"],
      icon: IconDeviceComputerCamera,
    },
    {
      title: "Dashboard",
      url: `/dashboard`,
      level: ["DRIVER"],
      icon: IconDashboard,
    },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   level: [""],
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ];

  return Items;
}
