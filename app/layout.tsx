import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Payment Checkout App",
  description: "Swish payment checkout prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
