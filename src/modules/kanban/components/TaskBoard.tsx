import { useTask } from "@/contexts/task-context";
import { Column } from "./Column";
import { Task } from "@/modules/tasks/api"
import { TaskStatus } from "@/modules/tasks/api/types";

interface TaskBoardProps {
    task?: Task;
    standaloneTasks?: Task[];
}

export function TaskBoard({ task, standaloneTasks }: TaskBoardProps) {
    const { handleTaskClick } = useTask();
    const getCardsByStatus = (status: Task["status"]) => {
        if (task) {
            return task.subtasks?.filter((card) => card.status === status);
        } else {
            return standaloneTasks?.filter((card) => card.status === status) || [];
        }
    };

    const getBackgroundColor = () => {
        if (!task?.dueDate) return "bg-white";
        if (task?.id == "others") return "bg-white";
        
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 1) return "bg-red-500";
        if (diffDays <= 3) return "bg-yellow-500";
        return "bg-white";
    };

    return (
        <div className="mb-8">
            <div className="flex flex-row items-center">
                <h1 className="text-xl font-bold mb-4 cursor-pointer" onClick={() => {
                    if (task) {
                        handleTaskClick(task);
                    }
                }}>
                    {task ? (
                        <span className={`p-2 rounded-sm hover:opacity-80`}>
                            {task.name}
                        </span>
                    ) : (
                        <span className="hover:underline">
                            Others Tasks
                        </span>
                    )}
                </h1>
                <div className={`rounded-full w-5 h-5 ${getBackgroundColor()} mb-4`}></div>
            </div>
            <div className="flex">
                <Column
                    status={"TODO" as TaskStatus}
                    cards={getCardsByStatus(TaskStatus.TODO) || []}
                    taskId={task?.id || ""}
                />
                <Column
                    status={"IN_PROGRESS" as TaskStatus}
                    cards={getCardsByStatus(TaskStatus.IN_PROGRESS) || []}
                    taskId={task?.id || ""}
                />
                <Column
                    status={"DONE" as TaskStatus}
                    cards={getCardsByStatus(TaskStatus.DONE) || []}
                    taskId={task?.id || ""}
                />
            </div>
        </div>
    );
} 