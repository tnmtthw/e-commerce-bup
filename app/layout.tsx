import clsx from "clsx";
import { fontSans } from "@/config/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html  suppressHydrationWarning lang="en">
      <head />
      <body   className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <main>{children}</main>
      </body>
    </html>
  )
}