import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fun Day Planner",
    short_name: "Fun Day",
    description:
      "Plan stalls, track spending, and manage your church family fun day fundraising event.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#5f7d65",
    orientation: "portrait-primary",
    categories: ["finance", "productivity"],
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
