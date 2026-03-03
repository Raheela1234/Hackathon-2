import type { Metadata } from "next";
import "./globals.css";
import { BetterAuthProvider } from "@/components/auth/BetterAuthProvider";

export const metadata: Metadata = {
  title: "Todo App | Manage Your Tasks",
  description: "A simple and efficient task management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <BetterAuthProvider>{children}</BetterAuthProvider>
      </body>
    </html>
  );
}
