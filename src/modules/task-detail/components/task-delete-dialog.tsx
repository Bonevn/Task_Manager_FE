import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/modules/ui/dialog";
import { Button } from "@/modules/ui/button";
import { useDeleteTask } from "@/modules/tasks/api/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface TaskDeleteDialogProps {
	taskId: string;
	projectId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function TaskDeleteDialog({ taskId, projectId, open, onOpenChange }: TaskDeleteDialogProps) {
	const { mutate: deleteTask, isPending } = useDeleteTask();
    const router = useRouter();
    const handleDeleteTask = () => {
        deleteTask(taskId, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success("Task deleted successfully");
                router.push(`/dashboard/kanban/${projectId}`);
            },
            onError: (error) => {
                toast.error("Failed to delete task: " + error.message);
            }
        });
    };

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Task</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this task?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
					<Button variant="destructive" className="text-white" onClick={handleDeleteTask} disabled={isPending}>{isPending ? "Deleting..." : "Delete"}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}