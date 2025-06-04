"use client";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { Task } from "@/modules/tasks/api/types";

interface ContainerProps {
    id: string;
    items: Task[];
    title: string;
}

export function Container({ id, items, title }: ContainerProps) {
    const { setNodeRef, isOver } = useDroppable({
        id,
        data: {
            type: "container",
            containerId: id,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`w-full p-4 bg-gray-100 rounded-sm mb-4 min-h-[200px] ${
                isOver ? "ring-2 ring-blue-500" : ""
            }`}
        >
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <SortableContext
                items={items.map(item => item.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-2">
                    {items.filter(Boolean).map((item) => (
                        <SortableItem key={item.id} task={item} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
} 