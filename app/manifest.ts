import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fun Day Planner",
    short_name: "Fun Day",
    description:
      "Plan stalls, track spending, and manage your church family fun day fundraising event.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff8f1",
    theme_color: "#0d9488",
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
