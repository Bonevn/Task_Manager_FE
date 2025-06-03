import { CloudUpload } from "lucide-react";
import { useRef } from "react";
import { useUploadUserImage } from "@/modules/user-settings/api/hooks";

export function FileEmptyState({ onClick, userId }: { onClick: () => void; userId: string }) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { mutate: uploadFile, isPending } = useUploadUserImage();

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			uploadFile({ file, userId });
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
					Upload image
				</span>
			</div>
		</div>
	);
}