"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Loader from "./Loader";

/**
 * Wraps pages that require login. Auth lives in localStorage, which is
 * only readable on the client, so this check runs in an effect after
 * mount rather than blocking the server render.
 */
export default function ProtectedRoute({ children }: { readonly children: ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) {
    return <Loader label="Checking session..." />;
  }

  return <>{children}</>;
}
