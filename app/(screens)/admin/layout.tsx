"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const lastIsMobile = useRef(isMobile);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const checkMobile = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 1024);
      }, 100);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    // On mobile, only allow /admin/forbidden
    if (isMobile && pathname !== "/admin/forbidden") {
      if (pathname.startsWith("/admin")) {
        router.replace("/admin/forbidden");
      }
    }
    // On desktop, if on forbidden, go to /admin
    if (!isMobile && pathname === "/admin/forbidden" && lastIsMobile.current) {
      router.replace("/admin");
    }
    lastIsMobile.current = isMobile;
  }, [isMobile, pathname, router]);

  if (isMobile && pathname !== "/admin/forbidden") {
    return <LoadingSpinner loadingText="Checking device..." />;
  }

  return <>{children}</>;
}
