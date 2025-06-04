"use client";

import TaskDetail from "@/modules/task-detail";
import { useParams } from "next/navigation";

export default function Task() {
	const params = useParams();
	const taskId = params.taskId as string;

	return <TaskDetail taskId={taskId} />;
}