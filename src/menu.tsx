import { MonitorCog } from "lucide-react";

export default function Menu() {
  // const role = useSelector((state: RootState) => state.user.role);

  const Items = [
    {
      title: "Demo",
      url: `/demo`,
      level: ["ADMIN"],
      icon: MonitorCog,
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
