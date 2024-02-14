import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren, ReactNode } from "react";
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { AuthProvider } from "./_providers/AuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: "app template",
  description: "😸",
};

export const viewport: Viewport = {
  // for mobile
  maximumScale: 1,
};

type Props = PropsWithChildren<{
  dialog: ReactNode;
}>;

export default function Layout({ dialog, children }: Props) {
  return (
    <html lang="en">
      <body
        className={[
          inter.className,
          "bg-gray-700 text-gray-200 h-screen flex flex-col",
          // for dialog
          "has-[dialog[open]]:overflow-hidden",
        ].join(" ")}
      >
        <AuthProvider>
          <Header />
          <main className="py-4 px-8 flex-1 overflow-y-auto">{children}</main>
          <Footer />
        </AuthProvider>
        {dialog}
      </body>
    </html>
  );
}
