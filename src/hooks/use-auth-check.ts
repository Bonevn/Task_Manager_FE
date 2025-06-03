"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function useAuthCheck() {
	const { checkAuth } = useAuth();
	const pathname = usePathname();
	const hasChecked = useRef(false);

	useEffect(() => {
		if (pathname.startsWith("/dashboard") && !hasChecked.current) {
			checkAuth();
			hasChecked.current = true;
		} else if (!pathname.startsWith("/dashboard")) {
			hasChecked.current = false;
		}
	}, [pathname, checkAuth]);
}
