import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import { Equal, SquareCheck, ChevronUp, ChevronDown } from "lucide-react";
import { useTask } from "@/contexts/task-context";
import { Task } from "@/modules/tasks/api/types";
import getImageUrl from "@/lib/get-image-url";

interface SortableCardProps {
	card: Task;
}

export function SortableCard({ card }: SortableCardProps) {
	const { handleTaskClick } = useTask();
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: card.id,
		data: {
			type: "card",
			card,
		},
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const getBackgroundColor = () => {
		if (!card.dueDate) return "bg-white";
		
		const dueDate = new Date(card.dueDate);
		const today = new Date();
		const diffTime = dueDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays <= 1) return "bg-red-500";
		if (diffDays <= 3) return "bg-yellow-500";
		return "bg-white";
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onClick={() => handleTaskClick(card)}
			className={`p-2 bg-white rounded-sm shadow-md cursor-pointer hover:opacity-80 flex flex-row justify-between`}
		>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-gray-500">{card.name}</p>
				<p className="text-sm font-medium min-h-[2.5rem] line-clamp-2">{card.description}</p>
				<div className="flex flex-row gap-1 items-center">
					<SquareCheck className={`w-5 h-5 ${card.parentId ? 'text-blue-500' : 'text-green-500'}`} />
					{card.priority === "LOW" && <ChevronDown className="w-5 h-5 text-green-500" />}
					{card.priority === "MEDIUM" && <Equal className="w-5 h-5 text-yellow-500" />}
					{card.priority === "HIGH" && <ChevronUp className="w-5 h-5 text-red-500" />}
					<div className={`h-3 w-3 rounded-full ml-2 ${getBackgroundColor()}`} />
				</div>
			</div>
			{card.assignee ? (
				<Avatar className="w-8 h-8">
					<AvatarImage src={getImageUrl(card.assignee.picture || "")} />
					<AvatarFallback>{card.assignee.name.charAt(0)}</AvatarFallback>
				</Avatar>
			) : (
				<Avatar className="w-8 h-8">
					<AvatarFallback>--</AvatarFallback>
				</Avatar>
			)}
		</div>
	);
}
