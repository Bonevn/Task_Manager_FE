"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { universalFetcher } from "@/lib/api";

interface User {
	id: string;
	email: string;
	name: string;
	phoneNumber: string | null;
	picture: string | null;
	bio: string | null;
}

interface AuthContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(() => {
		if (typeof window !== "undefined") {
			const storedUser = localStorage.getItem("user");
			return storedUser ? JSON.parse(storedUser) : null;
		}
		return null;
	});
	const router = useRouter();

	const checkAuth = async () => {
		try {
			const token = localStorage.getItem("access_token");
			if (!token) {
				setUser(null);
				router.push("/auth/login");
				return;
			}

			// Always check auth status when visiting dashboard
			const response = await universalFetcher<null, User>({
				url: "/api/auth/me",
			});

			setUser(response);
			localStorage.setItem("user", JSON.stringify(response));
		} catch (error: any) {
			// Check if the error is a 401 or 403
			if (error.status === 401) {
				localStorage.removeItem("access_token");
				localStorage.removeItem("user");
				setUser(null);
				router.push("/auth/login");
			}
		}
	};

	return (
		<AuthContext.Provider value={{ user, setUser, checkAuth }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
