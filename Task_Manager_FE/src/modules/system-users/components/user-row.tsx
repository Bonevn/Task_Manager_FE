import { User } from "@/modules/projects/api/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import { Button } from "@/modules/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/modules/ui/dropdownmenu";
import { useResetPassword, useUpdateUser } from "@/modules/user-settings/api/hooks";
import { Badge } from "@/modules/ui/badge";
import { toast } from "sonner";
import getImageUrl from "@/lib/get-image-url";

export function UserRow({ user }: { user: User }) {
	const resetPassword = useResetPassword(user.id);
	const updateUser = useUpdateUser(user.id);

	const handleResetPassword = async () => {
		try {
			const response = await resetPassword.mutateAsync();
			toast.success(`Password reset successfully. New password: ${response.data.password}`);
		} catch (error) {
			toast.error("Failed to reset password");
		}
	};

	const handleChangeRole = async (newRole: "USER" | "ADMIN") => {
		try {
			await updateUser.mutateAsync({ role: newRole });
			toast.success(`Role updated to ${newRole}`);
		} catch (error) {
			toast.error("Failed to update role");
		}
	};

	return (
		<div className="flex flex-row items-center justify-between gap-2 hover:bg-gray-100 p-2 rounded-md">
			<div className="flex flex-row items-center gap-2">
				<Avatar className="size-8">
					<AvatarImage className="size-8" src={getImageUrl(user.picture || "")} />
					<AvatarFallback className="size-8">{user.name.charAt(0)}</AvatarFallback>
				</Avatar>
				<p>{user.name}</p>
				<Badge variant={user.role === "ADMIN" ? "destructive" : "outline"}>{user.role === "ADMIN" ? "Admin" : "User"}</Badge>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<EllipsisVertical className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={handleResetPassword}>
						Reset Password
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleChangeRole("ADMIN")}>
						Change to Admin
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleChangeRole("USER")}>
						Change to User
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}