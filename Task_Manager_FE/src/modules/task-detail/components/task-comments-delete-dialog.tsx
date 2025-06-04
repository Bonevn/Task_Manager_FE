import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/modules/ui/dialog";
import { Button } from "@/modules/ui/button";
import { useDeleteComment } from "@/modules/tasks/api/hooks";
import { toast } from "sonner";

export interface TaskCommentsDeleteDialogProps {
	commentId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function TaskCommentsDeleteDialog({ commentId, open, onOpenChange }: TaskCommentsDeleteDialogProps) {
	const { mutate: deleteComment, isPending } = useDeleteComment();

    const handleDeleteComment = () => {
        deleteComment(commentId, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success("Comment deleted successfully");
            },
            onError: (error) => {
                toast.error("Failed to delete comment: " + error.message);
            }
        });
    };

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Comment</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this comment?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
					<Button variant="destructive" className="text-white" onClick={handleDeleteComment} disabled={isPending}>{isPending ? "Deleting..." : "Delete"}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}