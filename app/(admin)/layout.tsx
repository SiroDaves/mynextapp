import { MainLayout } from "@/components/app/dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App Portal | Dashboard",
  description: "App Portal | Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <MainLayout>{children}</MainLayout>
    </main>
  );
}
