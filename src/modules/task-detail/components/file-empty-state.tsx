import { CloudUpload } from "lucide-react";
import { useRef } from "react";
import { useUploadFile } from "@/modules/tasks/api/hooks";

export function FileEmptyState({ onClick, taskId }: { onClick: () => void; taskId: string }) {
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

	return (
		<div className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg">
			<div className="flex items-center gap-2">
				<CloudUpload className="w-7 h-7 text-gray-500" />
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileUpload}
					className="hidden"
				/>
				<span 
					className="text-gray-500 cursor-pointer hover:underline" 
					onClick={() => fileInputRef.current?.click()}
				>
					Upload file
				</span>
			</div>
		</div>
	);
}