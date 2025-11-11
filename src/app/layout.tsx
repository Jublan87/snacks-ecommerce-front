import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snacks Ecommerce - Tu distribuidor de snacks",
  description: "Encuentra los mejores snacks al mejor precio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

