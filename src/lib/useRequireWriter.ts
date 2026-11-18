"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { canWriteProperties } from "@/lib/types";

// Screens that create or edit data (property form, document manager) are for
// administrators only (CU-1.2.1/1.2.3, CU-1.4.1/1.4.3). The API already answers
// 403 on save; this keeps the other roles from seeing the form at all.
// Returns true only once the session is known to belong to an administrator.
export function useRequireWriter(): boolean {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let role: number | undefined;
    try {
      const token = localStorage.getItem("token");
      const saved = localStorage.getItem("user");
      if (!token || !saved) {
        router.replace("/login");
        return;
      }
      role = JSON.parse(saved)?.role;
    } catch {
      router.replace("/login");
      return;
    }

    if (!canWriteProperties(role)) {
      router.replace("/");
      return;
    }

    setAllowed(true);
  }, [router]);

  return allowed;
}
