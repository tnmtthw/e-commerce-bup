import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";
import { Providers } from "../providers";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/app/user/components/Navbar";
import Footer from "@/components/user/Footer";
import NavbarBottom from "./components/NavbarBottom";
import { NavbarMobile } from "./components/NavbarMobile";

export const metadata: Metadata = {
  title: "E-commerce",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
      <div className="flex flex-col min-h-screen">
          <Navbar />
          <NavbarMobile />
        <main className="container mx-auto w-full flex-grow pt-10 px-4 md:px-5">
          {children}
        </main>
        <div className="hidden md:block" >
          <Footer />
        </div>
        <div className="z-50 block md:hidden fixed bottom-0 w-full">
          <NavbarBottom />
        </div>
      </div>
    </Providers>
  );
}
