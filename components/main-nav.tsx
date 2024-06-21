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

  const pages = {
    home: "/",
    size: "/size",
    about: "/about",
    color: "/color",
    order: "/order",
    product: "/product",
    settings: "/settings",
    billboard: "/billboard",
    categories: "/categories",
  }

  const routes = [
    { 
      label: "Обзор",
      href: `/`,
      active: pathname === `/`,
    },
    { 
      label: "Рекламный щит",
      href: pages.billboard,
      active: pathname === pages.billboard || pathname.startsWith(pages.billboard),
    },
    { 
      label: "Категории",
      href: pages.categories,
      active: pathname === pages.categories || pathname.startsWith(pages.categories),
    },
    { 
      label: "Цвет",
      href: pages.color,
      active: pathname === pages.color || pathname.startsWith(pages.color),
    },
    { 
      label: "Размер",
      href: pages.size,
      active: pathname === pages.size || pathname.startsWith(pages.size),
    },
    { 
      label: "Продукция",
      href: pages.product,
      active: pathname === pages.product || pathname.startsWith(pages.product),
    },
    {
      label: "Заказы",
      href: pages.order,
      active: pathname === pages.order || pathname.startsWith(pages.order),
    },
    { 
      label: "О нас",
      href: pages.about,
      active: pathname === pages.about,
    },
    { 
      label: "Настройки",
      href: pages.settings,
      active: pathname === pages.settings,
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