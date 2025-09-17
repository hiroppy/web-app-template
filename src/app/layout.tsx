import { clsx } from "clsx";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { SentryProvider } from "./_providers/Sentry";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "web app template",
  description: "😸",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export const viewport: Viewport = {
  // for mobile
  maximumScale: 1,
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={clsx(
          inter.className,
          "bg-gray-700 text-gray-200 min-h-screen flex flex-col",
        )}
      >
        <SentryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SentryProvider>
      </body>
    </html>
  );
}
