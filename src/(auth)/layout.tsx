"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth";
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthStore();
  const router = useRouter();
  React.useEffect(() => {
    if (session) router.push("/");
  }, [session, router]);
  if (session) return null;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div>{children}</div>
    </div>
  );
};
export default Layout;
