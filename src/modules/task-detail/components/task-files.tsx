import { FileEmptyState } from "./file-empty-state";
import { File } from "./file";
import { Plus } from "lucide-react";
import { Button } from "@/modules/ui/button";
import { Attachment } from "@/modules/tasks/api/types";
import { useUploadFile } from "@/modules/tasks/api/hooks";
import { useRef } from "react";

interface TaskFilesProps {
	attachments: Attachment[];
	taskId: string;
}

export function TaskFiles({ attachments, taskId }: TaskFilesProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { mutate: uploadFile, isPending } = useUploadFile();

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			uploadFile({ file, taskId });
		}
		// Reset the input value so the same file can be selected again
		event.target.value = '';
	};

	if (attachments.length === 0) {
		return <FileEmptyState onClick={() => fileInputRef.current?.click()} taskId={taskId} />;
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-row justify-between items-center">
                <p className="text-lg font-bold">Attachments</p>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isPending}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>
			{attachments.map((attachment) => (
				<File key={attachment.id} id={attachment.id} url={attachment.url} createdAt={attachment.createdAt} taskId={taskId} />
			))}
		</div>
	);
}
