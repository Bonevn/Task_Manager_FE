"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { useLoginMutation, useRegisterMutation } from "@/modules/auth/api";
import { useRouter } from "next/navigation";

interface AuthFormProps extends React.ComponentPropsWithoutRef<"form"> {
	variant: "login" | "register";
}

export function AuthForm({
	variant,
	className,
	...props
}: AuthFormProps) {
	const router = useRouter();
	const { mutate: login, isPending: isLoginPending } = useLoginMutation();
	const { mutate: register, isPending: isRegisterPending } =
		useRegisterMutation();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const name = formData.get("name") as string;

		if (variant === "login") {
			login(
				{ email, password },
				{
					onSuccess: (response) => {
						localStorage.setItem("access_token", response.access_token);
						router.push("/dashboard");
					},
				}
			);
		} else {
			register(
				{ email, password, name },
				{
					onSuccess: (response) => {
						localStorage.setItem("access_token", response.data as string);
						router.push("/dashboard");
					},
				}
			);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={cn("flex flex-col gap-6", className)}
			{...props}
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">
					{variant === "login"
						? "Login to your account"
						: "Create an account"}
				</h1>
				<p className="text-balance text-sm text-muted-foreground">
					{variant === "login"
						? "Enter your email below to login to your account"
						: "Enter your email below to create an account"}
				</p>
			</div>
			<div className="grid gap-6">
				{variant === "register" && (
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="John Doe"
							required
						/>
					</div>
				)}
				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="m@example.com"
						required
					/>
				</div>
				<div className="grid gap-2">
					<div className="flex items-center">
						<Label htmlFor="password">Password</Label>
						<a
							href="#"
							className="ml-auto text-sm underline-offset-4 hover:underline"
						>
							Forgot your password?
						</a>
					</div>
					<Input id="password" name="password" type="password" required />
				</div>
				<Button
					type="submit"
					className="w-full"
					disabled={isLoginPending || isRegisterPending}
				>
					{isLoginPending || isRegisterPending
						? "Logging in..."
						: "Login"}
				</Button>
				<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
					<span className="relative z-10 bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
				<Button variant="outline" className="w-full">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path
							d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
							fill="currentColor"
						/>
					</svg>
					Login with GitHub
				</Button>
			</div>
			<div className="text-center text-sm">
				{variant === "login" ? (
					<>
						Don&apos;t have an account?{" "}
						<a
							href="/auth/register"
							className="underline underline-offset-4"
						>
							Sign up
						</a>
					</>
				) : (
					<>
						Already have an account?{" "}
						<a
							href="/auth/login"
							className="underline underline-offset-4"
						>
							Sign in
						</a>
					</>
				)}
			</div>
		</form>
	);
}
