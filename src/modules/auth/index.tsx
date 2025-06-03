import { GalleryVerticalEnd } from "lucide-react";

import { AuthForm } from "@/modules/auth/components/auth-form";

interface AuthPageProps {
	variant: "login" | "register";
}

export default function AuthPage({ variant }: AuthPageProps) {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<AuthForm variant={variant} />
					</div>
				</div>
			</div>
			<div className="relative hidden bg-foreground lg:flex items-center justify-center">
				<GalleryVerticalEnd className="size-40 text-background" />
			</div>
		</div>
	);
}
