"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { Textarea } from "@/modules/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/modules/ui/dialog";
import { useGetProjectById } from "@/modules/projects/api/hooks";
import { universalFetcher } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

interface ProjectSettingsProps {
    projectId: string;
}

export default function ProjectSettings({ projectId }: ProjectSettingsProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: project } = useGetProjectById(projectId);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        key: "",
        description: "",
    });

    // Initialize form data when project data is loaded
    useEffect(() => {
        if (project?.data) {
            setFormData({
                name: project.data.name,
                key: project.data.key,
                description: project.data.description,
            });
        }
    }, [project?.data]);

    const handleInputChange = (field: string, value: string | null) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUpdateProject = async () => {
        if (!formData.name || !formData.key) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            await universalFetcher({
                url: `/api/projects/${projectId}`,
                method: "PATCH",
                body: formData
            });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast.success("Project updated successfully");
        } catch (error) {
            toast.error("Failed to update project: " + (error as Error).message);
        }
    };

    const handleDeleteProject = async () => {
        try {
            await universalFetcher({
                url: `/api/projects/${projectId}`,
                method: "DELETE"
            });
            // Invalidate projects query to update the navbar dropdown
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast.success("Project deleted successfully");
            router.push("/dashboard");
        } catch (error) {
            toast.error("Failed to delete project: " + (error as Error).message);
        }
    };

    return (
        <div className="flex flex-col h-full gap-8">
            <div className="flex flex-col gap-0.5">
				<p className="text-sm text-gray-500">Project Settings</p>
				<p className="text-2xl font-bold">{project?.data.name}</p>
			</div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Project Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Enter project name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="key">Project Key *</Label>
                        <Input
                            id="key"
                            value={formData.key}
                            onChange={(e) => handleInputChange("key", e.target.value)}
                            placeholder="Enter project key"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Enter project description"
                        />
                    </div>
                </div>
                <div className="flex gap-4 mt-4">
                    <Button onClick={handleUpdateProject}>Save Changes</Button>
                    <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>Delete Project</Button>
                </div>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Project</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this project? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive"  onClick={handleDeleteProject}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>            
    );
}
