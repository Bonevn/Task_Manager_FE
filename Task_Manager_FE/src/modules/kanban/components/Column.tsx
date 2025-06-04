import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableCard } from "./SortableCard";
import { Task } from "@/modules/tasks/api/types";

//interface Card extends CardInterface {}

interface ColumnProps {
    status: Task["status"];
    cards: Task[];
    taskId: string;
}

export function Column({ status, cards, taskId }: ColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: `${taskId}=${status}`,
        data: {
            type: "column",
            status,
            taskId,
        },
    });

    const getColumnTitle = (status: string) => {
        switch (status) {
            case "TODO":
                return "To Do";
            case "IN_PROGRESS":
                return "In Progress";
            case "DONE":
                return "Done";
            default:
                return status;
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`flex-1 p-4 bg-gray-100 rounded-sm mx-2 ${
                isOver ? "ring-2 ring-blue-500" : ""
            }`}
        >
            <h2 className="text-md font-semibold mb-4">
                {getColumnTitle(status)}
            </h2>
            <SortableContext
                items={cards}
                strategy={verticalListSortingStrategy}
            >
                <div className="grid gap-2 auto-rows-min">
                    {cards.map((card) => (
                        <SortableCard
                            key={card.id}
                            card={card}
                        />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
} 