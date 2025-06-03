import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/modules/ui/dialog";
import { Button } from "@/modules/ui/button";
import { useCreateProject } from "@/modules/projects/api";
import { toast } from "sonner";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { Textarea } from "@/modules/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
export interface NewProjectDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
	const router = useRouter();
	const { mutate: createProject, isPending } = useCreateProject();
	const [formData, setFormData] = useState({
		name: "",
		key: "",
		description: ""
	});

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleCreateProject = () => {
		if (!formData.name || !formData.key) {
			toast.error("Please fill in all required fields");
			return;
		}

		createProject(formData, {
			onSuccess: (newProject) => {
				toast.success("Project created successfully");
				router.push(`/dashboard/backlog/${newProject.data.id}`);
				onOpenChange(false);
			},
			onError: (error) => {
				toast.error("Failed to create project: " + error.message);
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New Project</DialogTitle>
					<DialogDescription>
						Create a new project to start tracking your tasks.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
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
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
					<Button variant="destructive" className="text-white" onClick={handleCreateProject} disabled={isPending}>
						{isPending ? "Creating..." : "Create Project"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}