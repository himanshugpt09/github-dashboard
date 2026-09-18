import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
import { EffectsProvider } from "@/components/dashboard/effects-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Himanshu Gupta · GitHub Dashboard",
  description:
    "Interactive glassmorphism dashboard for Himanshu Gupta (himanshugpt09). Live GitHub stats, contribution universe, tech stack galaxy, and more.",
  keywords: [
    "Himanshu Gupta",
    "himanshugpt09",
    "GitHub Dashboard",
    "Developer Portfolio",
    "Glassmorphism",
    "Next.js",
  ],
  authors: [{ name: "Himanshu Gupta" }],
  icons: {
    icon: "https://avatars.githubusercontent.com/u/195284563?v=4",
  },
  openGraph: {
    title: "Himanshu Gupta · GitHub Dashboard",
    description: "Interactive glassmorphism developer dashboard",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Himanshu Gupta · GitHub Dashboard",
    description: "Interactive glassmorphism developer dashboard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <EffectsProvider>
            {children}
            <Toaster />
          </EffectsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
