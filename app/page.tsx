"use client";
import { useAuthStore } from "@/state/auth/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  if (isAuthenticated) {
    router.push("/dashboard");
  } else {
    router.push("/login");
  }

  return <div></div>;
}
