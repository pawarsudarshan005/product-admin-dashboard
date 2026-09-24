"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Loader from "@/components/common/Loader";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(isAuthenticated() ? "/products" : "/login");
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50">
      <Loader />
    </div>
  );
}
