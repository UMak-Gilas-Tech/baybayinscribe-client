import type { Metadata } from "next";

export const siteConfig = {
  name: "User Auth",
  description: "Learn Baybayin script interactively",
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
}; 