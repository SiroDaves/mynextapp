import { NavigationProps, UserMenuNavigationProps } from "@/lib/app";

export const sidebarNavigation: NavigationProps[] = [
  {
    label: "Dashboards",
    path: "/dashboard",
    icon: "dashboard",
  },
  {
    label: "New Apps",
    path: "/new-apps",
    icon: "product",
  },
  {
    label: "Relist Amended",
    path: "/relist-amended",
    icon: "relisted",
  },
  {
    label: "Medical U/W",
    path: "/medical-underwriting",
    icon: "medical",
  },
  {
    label: "Relisted Apps",
    path: "/relisted",
    icon: "relisted",
  },
  {
    label: "AML Apps",
    path: "/aml-apps",
    icon: "product",
  },
  {
    label: "Approved",
    path: "/approved",
    icon: "product",
  },
  {
    label: "Unposted Payments",
    path: "/unposted-payments",
    icon: "payment",
  },
];

export const adminSidebarNavigation: NavigationProps[] =
  sidebarNavigation.concat([
    {
      label: "Users",
      path: "/users",
      icon: "users",
    },
  ]);

export const userMenuNavigation: UserMenuNavigationProps[] = [
  { label: "Sign out", path: "/logout" },
];
