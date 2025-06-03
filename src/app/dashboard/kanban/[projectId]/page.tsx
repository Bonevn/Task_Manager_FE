"use client";

import Kanban from "@/modules/kanban";
import { useTask } from "@/contexts/task-context";
import { useParams } from "next/navigation";

export default function KanbanPage() {
	const params = useParams();
	const projectId = params.projectId as string;

	return <Kanban projectId={projectId} />;
}
