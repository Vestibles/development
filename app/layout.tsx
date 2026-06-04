import type { Metadata, Viewport } from "next";
import { EventProvider } from "@/lib/context/EventContext";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fun Day Planner",
  description:
    "Plan stalls, track spending, and manage your church family fun day fundraising event.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#faf8f5",
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
          <AppShell>{children}</AppShell>
        </EventProvider>
      </body>
    </html>
  );
}
