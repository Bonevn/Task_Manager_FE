import { Button } from "@/modules/ui/button";
import { FileIcon, Download, MoreVertical, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/modules/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/modules/ui/dialog";
import { useState } from "react";

interface FileProps {
	id: string;
	url: string;
	createdAt: string;
	taskId: string;
}

export function File({ id, url, createdAt, taskId }: FileProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const queryClient = useQueryClient();

	const downloadFile = async (id: string) => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/${id}`);
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = id;
		a.click();
	}

	const deleteFile = async (id: string) => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/${id}`, {
			method: "DELETE",
		});
		const data = await response.json();
		queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
		setShowDeleteDialog(false);
	}

	return (
		<>
			<div className="flex flex-row justify-between items-center hover:bg-gray-100 rounded-lg p-2 group">
				<div className="flex flex-row items-center gap-2">
					<FileIcon className="w-8 h-8 text-gray-500" />
					<div className="flex flex-col">
						<span className="text-sm font-medium">
							{(() => {
								const filename = url.split("/").pop() || "";
								const extension = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : "";
								return filename.slice(0, 10) + "..." + extension;
							})()}
						</span>
						<span className="text-sm text-gray-500">{createdAt}</span>
					</div>
				</div>
				<div className="flex flex-row items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
								<MoreVertical className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => downloadFile(id)}>
								<Download className="w-4 h-4 mr-2" />
								Download
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
								<Trash2 className="w-4 h-4 mr-2" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete File</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this file? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={() => deleteFile(id)}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}