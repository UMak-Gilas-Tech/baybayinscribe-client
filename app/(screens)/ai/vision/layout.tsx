export const metadata = {
  title: {
    default: "BaybayInscribe | Vision",
    template: "%s | BaybayInscribe",
  },
};

export default function VisionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col w-full h-full">{children}</div>;
}
