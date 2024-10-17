import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";
import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/user/navbar";
import Footer from "@/components/user/footer";

export const metadata: Metadata = {
  title: "E-commerce",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main>
              <div className="container mx-auto w-full h-full pt-10 px-4 md:px-5">
                {children}
              </div>
              <Footer />
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
