import { clsx } from "clsx";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren } from "react";
import { Header } from "./_components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: "",
  description: "",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={clsx("bg-gray-800 text-gray-200", inter.className)}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
