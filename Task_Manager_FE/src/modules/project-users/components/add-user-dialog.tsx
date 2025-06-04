import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/modules/ui/dialog";
import { Button } from "@/modules/ui/button";
import { Label } from "@/modules/ui/label";
import { UserSelect } from "@/modules/ui/user-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/ui/select";
import { useState } from "react";
import { useAddProjectUser } from "@/modules/user-settings/api";
import { ProjectUser } from "@/modules/user-settings/api/types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const PROJECT_ROLES = [
    { value: "ADMIN", label: "Admin" },
    { value: "PM", label: "Project Manager" },
    { value: "DEV", label: "Developer" },
    { value: "TESTER", label: "Tester" },
    { value: "MEMBER", label: "Member" },
    { value: "OWNER", label: "Owner" },
] as const;

type ProjectRole = typeof PROJECT_ROLES[number]["value"];

export function AddUserDialog({ projectId }: { projectId: string }) {
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<ProjectRole>("MEMBER");
    const [open, setOpen] = useState(false);
    const addProjectUser = useAddProjectUser(projectId, selectedUser || "");
    const queryClient = useQueryClient();

    const handleAddUser = async () => {
        if (!selectedUser) return;

        try {
            await addProjectUser.mutateAsync(selectedRole);
            toast.success("User added to project successfully");
            
            // Invalidate and refetch project users
            await queryClient.invalidateQueries({ queryKey: ["project-users", projectId] });
            
            // Reset form and close dialog
            setSelectedUser(null);
            setSelectedRole("MEMBER");
            setOpen(false);
        } catch (error) {
            console.error("Failed to add user to project:", error);
            toast.error("Failed to add user to project");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add User</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Add a user to the project
                </DialogDescription>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>User</Label>
                        <UserSelect
                            value={selectedUser}
                            onValueChange={setSelectedUser}
                            placeholder="Select a user"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Role</Label>
                        <Select 
                            value={selectedRole} 
                            onValueChange={(value: ProjectRole) => setSelectedRole(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {PROJECT_ROLES.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        onClick={handleAddUser}
                        disabled={!selectedUser || addProjectUser.isPending}
                    >
                        {addProjectUser.isPending ? "Adding..." : "Add User"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}