import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "QuickPay - Invoice Management",
  description: "Manage your invoices and payments efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
