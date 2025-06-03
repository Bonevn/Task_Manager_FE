import TaskDetailBodyItem from "./components/task-detail-body-item";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import { User } from "@/modules/projects/api/types";
import { useAuth } from "@/contexts/auth-context";
import { useEditTask } from "@/modules/tasks/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface TaskRelatedPeopleProps {
    reporter: User;
    assignee: User;
    taskId: string;
}

export default function TaskRelatedPeople({
    reporter,
    assignee,
    taskId,
}: TaskRelatedPeopleProps) {
    const { user } = useAuth();
    const { mutate: editTask } = useEditTask(taskId);
    const queryClient = useQueryClient();

    const handleAssignToMe = () => {
        if (!user) {
            toast.error("You must be logged in to assign tasks");
            return;
        }

        editTask(
            { assigneeId: user.id },
            {
                onSuccess: () => {
                    toast.success("Task assigned to you successfully");
                    queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
                },
                onError: (error) => {
                    toast.error("Failed to assign task: " + error.message);
                },
            }
        );
    };

    return (
        <TaskDetailBodyItem
            title="People"
            items={[
                {
                    key: "Reporter",
                    value: (
                        <div className="flex flex-row items-center gap-2">
                            <Avatar className="size-6">
                                <AvatarImage src={reporter.picture || ""} />
                                <AvatarFallback>{reporter.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <p>{reporter.name}</p>
                        </div>
                    ),
                },
                {
                    key: "Assignee",
                    value: (
                        <div className="flex flex-row items-center gap-2">
                            <Avatar className="size-6">
                                <AvatarImage src={assignee.picture || ""} />
                                <AvatarFallback>{assignee.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>{assignee.name}</div>
                        </div>
                    ),
                },
                {
                    key: "Action",
                    value: (
                        <button 
                            onClick={handleAssignToMe}
                            className="text-blue-500 hover:text-blue-600 hover:underline text-left cursor-pointer"
                        >
                            Assign to me
                        </button>
                    ),
                }
            ]}
        />
    );
}
