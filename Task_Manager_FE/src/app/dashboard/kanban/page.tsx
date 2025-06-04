"use client";

import Kanban from "@/modules/kanban";
import { useTask } from "@/contexts/task-context";

export default function KanbanPage() {
	const { handleTaskClick } = useTask();
	return <Kanban onTaskClick={handleTaskClick} />;
}
