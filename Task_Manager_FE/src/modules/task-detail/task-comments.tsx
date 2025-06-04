"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import { Separator } from "@/modules/ui/separator";
import { Input } from "@/modules/ui/input";
import { Button } from "@/modules/ui/button";
import { forwardRef, useState } from "react";
import { Comment } from "@/modules/tasks/api/types";
import { useCreateComment } from "@/modules/tasks/api/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { EllipsisVertical } from 'lucide-react';
import TaskCommentsDeleteDialog from "./components/task-comments-delete-dialog";
import { toast } from "sonner";
import { RoleBadge } from "../ui/role-badge";

const CommentItem = ({ user, createdAt, content, onDelete }: Comment & { onDelete: () => void }) => {
	return (
		<div className="flex flex-col gap-3 pt-3">
			<div className="flex flex-row items-center gap-2">
				<Avatar className="size-5">
					<AvatarImage src={user?.picture || ""} />
					<AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
				</Avatar>
				<div className="flex flex-row items-center gap-2">
					<a href="#" className="underline text-blue-500">{user?.name}</a>
                    <RoleBadge role={user?.role || "USER"} />
					<span>{new Date(createdAt).toLocaleString()}</span>
				</div>
				<Button variant="ghost" size="icon" onClick={onDelete}>
					<EllipsisVertical className="h-4 w-4" />
				</Button>
			</div>
			<p>{content}</p>
            <Separator />
		</div>
	);
};

export default forwardRef<HTMLInputElement | null, {
    comments: Comment[];
    taskId: string;
}>(({ comments, taskId }, ref) => {
	const [comment, setComment] = useState("");
    const { mutate: createComment, isPending } = useCreateComment();
    const queryClient = useQueryClient();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);

    const handleCreateComment = () => {
        if (!comment.trim()) {
            return;
        }
        
        createComment(
            { content: comment, taskId },
            {
                onSuccess: () => {
                    setComment("");
                    queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
                    toast.success("Comment added successfully");
                },
                onError: (error) => {
                    toast.error("Failed to add comment: " + error.message);
                }
            }
        );
    };

	return (
		<div className="flex flex-col gap-3">
			<p className="text-lg font-bold">Comments</p>
			<div>
				{comments.length > 0 ? (
					comments.map((comment, index) => (
						<CommentItem key={index} {...comment} onDelete={() => {
							setSelectedCommentId(comment.id);
							setDeleteDialogOpen(true);
						}} />
					))
				) : (
					<p className="text-muted-foreground">No comment yet.</p>
				)}
			</div>
            <div className="flex flex-row gap-2">
                <Input 
                    ref={ref} 
                    placeholder="Add a comment..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleCreateComment();
                        }
                    }}
                />
                <Button 
                    onClick={handleCreateComment} 
                    disabled={isPending}
                >
                    {isPending ? "Posting..." : "Post"}
                </Button>
            </div>
			<TaskCommentsDeleteDialog
				commentId={selectedCommentId!}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			/>
		</div>
	);
});
