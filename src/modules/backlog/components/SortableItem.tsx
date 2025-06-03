"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTask } from "@/contexts/task-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import { SquareCheck, Equal } from "lucide-react";
import { Task } from "@/modules/tasks/api/types";
import getImageUrl from "@/lib/get-image-url";

interface SortableItemProps {
    task: Task;
}

export function SortableItem({ task }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "item",
            item: task,
        },
    });

    const getBackgroundColor = () => {
        if (!task.dueDate) return "bg-white";
        
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 1) return "bg-red-500";
        if (diffDays <= 3) return "bg-yellow-500";
        return "bg-white";
    };

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const { handleTaskClick } = useTask();

    const handleClick = (e: React.MouseEvent) => {
        if (!isDragging) {
            handleTaskClick(task);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={handleClick}
            className={`p-2 bg-white rounded-sm shadow-md cursor-pointer hover:opacity-80 flex flex-row justify-between items-center pr-10`}
        >
            <div className="flex flex-row gap-1 items-center">
                <SquareCheck className="w-5 h-5 text-green-500" />
                <Equal className="w-5 h-5 text-gray-500 text-yellow-500" />
                <p className="text-sm font-medium text-blue-500">{task.name}</p>
                <p className="text-sm font-medium">{task.description?.slice(0, 50)}</p>
                <div className={`h-3 w-3 rounded-full ml-2 ${getBackgroundColor()}`} />
            </div>
            <Avatar className="w-6 h-6">
                <AvatarImage src={getImageUrl(task.assignee?.picture || "")} />
                <AvatarFallback>{task.assignee?.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
        </div>
    );
} 