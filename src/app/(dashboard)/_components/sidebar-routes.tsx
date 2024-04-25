"use client";

import { Compass, Layout } from "lucide-react";
import SidebarItem from "./sidebar-item";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/"
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search"
  },
];

type Props = {}

const SidebarRoutes = (props: Props) => {
  const routes = guestRoutes;
  
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          href={route.href}
          icon={route.icon}
          label={route.label}
        />
      ))}
    </div>
  )
}

export default SidebarRoutes