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

  const routes = [
    { 
      label: "Overview",
      href: `/`,
      active: pathname === `/`,
    },
    { 
      label: "Billboard",
      href: `/billboard`,
      active: pathname === `/billboard`,
    },
    { 
      label: "Categories",
      href: `/categories`,
      active: pathname === `/categories`,
    },
    { 
      label: "Size",
      href: `/size`,
      active: pathname === `/size`,
    },
    { 
      label: "Color",
      href: `/color`,
      active: pathname === `/color`,
    },
    { 
      label: "Products",
      href: `/product`,
      active: pathname === `/product`,
    },
    { 
      label: "Orders",
      href: `/order`,
      active: pathname === `/order`,
    },
    { 
      label: "Settings",
      href: `/settings`,
      active: pathname === `/settings`,
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