import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { Toaster } from "@/components/ui/sonner";
import ThemeInitializer from "@/components/ThemeInitializer";
import AuthInitializer from "@/components/AuthInitializer";
import Navigation from "@/components/Navigation";
import TokenRefreshProvider from "@/components/TokenRefreshProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eCommerce Shop",
  description: "Modern eCommerce shop built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ThemeInitializer />
          <AuthInitializer />
          <TokenRefreshProvider />
          <Suspense fallback={
            <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
              <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
                <div className="text-lg sm:text-xl md:text-2xl font-bold gradient-text">Go Shopping</div>
                <div className="h-9 w-9 bg-muted animate-pulse rounded"></div>
              </div>
            </nav>
          }>
            <Navigation />
          </Suspense>
          <main className="min-h-screen pb-8">
            {children}
          </main>
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
