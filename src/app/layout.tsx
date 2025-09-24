import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { LogoContainer } from "./_components/layout/logo";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "x402scan",
  description: "See what's happening in the x402 ecosystem",
};

export default function RootLayout({
  children,
  breadcrumbs,
}: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          storageKey="x402scan-theme"
          enableSystem={true}
        >
          <div className="min-h-screen flex flex-col relative">
            <LogoContainer>
              <Link href="/">
                <Logo className="size-auto h-full aspect-square" />
              </Link>
            </LogoContainer>
            <header className="w-full flex flex-col pt-4 justify-center bg-card">
              <div className="flex items-center justify-between w-full px-2 md:px-6 pb-0 md:pb-0 h-10">
                <div className="pl-10 md:pl-12 flex items-center gap-2 md:gap-3">
                  {breadcrumbs}
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <AnimatedThemeToggler />
                </div>
              </div>
            </header>
            <div className="bg-background flex-1 flex flex-col">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
