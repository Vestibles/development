import type { Metadata, Viewport } from "next";
import { EventProvider } from "@/lib/context/EventContext";
import { AppShell } from "@/components/layout/AppShell";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fun Day Planner",
  description:
    "Plan stalls, track spending, and manage your church family fun day fundraising event.",
  applicationName: "Fun Day Planner",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fun Day",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/logo.png",
    apple: "/icons/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d9488",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <EventProvider>
          <InstallPrompt />
          <AppShell>{children}</AppShell>
        </EventProvider>
      </body>
    </html>
  );
}
