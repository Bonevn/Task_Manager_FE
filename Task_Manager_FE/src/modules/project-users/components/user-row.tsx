import { ProjectUser } from "@/modules/user-settings/api/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import { Button } from "@/modules/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/modules/ui/dropdownmenu";
import {
	useAddProjectUser,
	useDeleteProjectUser,
	useResetPassword,
	useUpdateProjectUser,
	useUpdateUser,
} from "@/modules/user-settings/api/hooks";
import { Badge } from "@/modules/ui/badge";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { RoleBadge } from "@/modules/ui/role-badge";
import getImageUrl from "@/lib/get-image-url";

export function UserRow({
	user,
	projectId,
}: {
	user: ProjectUser;
	projectId: string;
}) {
	const resetPassword = useResetPassword(user.user.id);
	const updateUser = useUpdateUser(user.user.id);
	const addUser = useAddProjectUser(projectId, user.user.id);
	const updateUserRole = useUpdateProjectUser(projectId, user.user.id);
	const deleteUser = useDeleteProjectUser(projectId, user.user.id);
	const queryClient = useQueryClient();
	const handleChangeRole = async (newRole: ProjectUser["role"]) => {
		try {
			await updateUserRole.mutateAsync(newRole);
			toast.success(`Role updated to ${newRole}`);
			queryClient.invalidateQueries({ queryKey: ["project-users", projectId] });
		} catch (error) {
			toast.error("Failed to update role");
		}
	};

	const handleDeleteUser = async () => {
		try {
			await deleteUser.mutateAsync();
			toast.success("User deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["project-users", projectId] });
		} catch (error) {
			toast.error("Failed to delete user");
		}
	};

	const handleResetPassword = async () => {
		await resetPassword.mutateAsync();
		toast.success("Password reset successfully");
	};

	return (
		<div className="flex flex-row items-center justify-between gap-2 hover:bg-gray-100 p-2 rounded-md">
			<div className="flex flex-row items-center gap-2">
				<Avatar className="size-8">
					<AvatarImage
						className="size-8"
						src={getImageUrl(user.user.picture || "")}
					/>
					<AvatarFallback className="size-8">
						{user.user.name.charAt(0)}
					</AvatarFallback>
				</Avatar>
				<p>{user.user.name}</p>
				<RoleBadge role={user.role || "USER"} />
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<EllipsisVertical className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => handleChangeRole("OWNER")}>
						Change to Owner
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleChangeRole("ADMIN")}>
						Change to Admin
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleChangeRole("MEMBER")}
					>
						Change to Member
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleChangeRole("TESTER")}
					>
						Change to Tester
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleChangeRole("DEV")}>
						Change to Developer
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleChangeRole("PM")}>
						Change to Project Manager
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleDeleteUser}>
						Delete User
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
