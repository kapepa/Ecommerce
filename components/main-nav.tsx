"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { FC, HTMLAttributes } from "react";

interface MainNavProps extends HTMLAttributes<HTMLElement> {
  className?: string,
}

const MainNav: FC<MainNavProps> = (props) => {
  const { className, ...onther } = props;
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    { 
      label: "Overview",
      href: `/${params.storeId}`,
      active: pathname === `/${params.storeId}`,
    },
    { 
      label: "Billboard",
      href: `/${params.storeId}/billboard`,
      active: pathname === `/${params.storeId}/billboard`,
    },
    { 
      label: "Categories",
      href: `/${params.storeId}/categories`,
      active: pathname === `/${params.storeId}/categories`,
    },
    { 
      label: "Settings",
      href: `/${params.storeId}/settings`,
      active: pathname === `/${params.storeId}/settings`,
    }
  ];
  
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...onther}>
      {routes.map((route, index) => (
        <Link 
          key={`${route.href}:${index}`}
          href={route.href}
          className={
            cn(
              "text-sm font-medium transition-colors hover:text-primary", 
              route.active ? "text-black dark:text-white" : "text-muted-foreground"
            )
          } 
        >
          { route.label }
        </Link>
        )
      )}
    </nav>
  )
}

export { MainNav }