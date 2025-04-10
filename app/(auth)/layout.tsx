import { AuthLayout } from "@/components/app/auth/auth-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App Portal",
  description: "App Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <AuthLayout message="Sign In">{children}</AuthLayout>
    </main>
  );
}
