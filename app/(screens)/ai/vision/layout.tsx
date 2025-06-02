import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Baybayin Vision AI - Real-time Baybayin Script Recognition",
  description:
    "Use our advanced AI to recognize and translate Baybayin script in real-time. Perfect for learning and understanding traditional Filipino writing.",
  keywords:
    "Baybayin, AI recognition, Filipino script, real-time translation, Baybayin learning",
  openGraph: {
    title: "Baybayin Vision AI - Real-time Baybayin Script Recognition",
    description:
      "Use our advanced AI to recognize and translate Baybayin script in real-time. Perfect for learning and understanding traditional Filipino writing.",
    type: "website",
  },
};

export default function VisionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
