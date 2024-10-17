import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";
import { Providers } from "../providers";
import { fontSans } from "@/config/fonts";
import Sidebar from "@/components/admin/sidebar";
import BreadCrumbs from "@/components/admin/breadcrumbs";
import OrderNotification from "./toast/OrderNotification";

export const metadata: Metadata = {
  title: "E-commerce-Admin",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
      <div className={clsx("flex", "min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Sidebar />
        <main className="flex-grow ml-64 mt-14 overflow-x-auto p-5">
          <BreadCrumbs />
          {children}
          <OrderNotification />
        </main>
      </div>
      <footer className="w-full flex items-center justify-center py-3" />
    </Providers>
  );
}