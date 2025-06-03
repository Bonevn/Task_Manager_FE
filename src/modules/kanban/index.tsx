"use client";
import {
	DndContext,
	DragOverlay,
	useDraggable,
	useDroppable,
	DragStartEvent,
	DragEndEvent,
	DragOverEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";

import { useState } from "react";
import { TaskBoard } from "./components/TaskBoard";
import { SortableCard } from "./components/SortableCard";
import { useGetProjectById } from "@/modules/projects/api/hooks";
import { useGetTasksByProjectId, useEditTask } from "@/modules/tasks/api/hooks";
import type { Task, TaskStatus } from "@/modules/tasks/api/types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
interface KanbanProps {
	projectId: string;
}

export default function Kanban({ projectId }: KanbanProps) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [activeCard, setActiveCard] = useState<Task | null>(null);
	const [clonedTasks, setClonedTasks] = useState<Task[] | null>(null);
	const { data: project, isLoading: isProjectLoading } = useGetProjectById(projectId);
	const { data: apiTasks, isLoading: isTasksLoading } = useGetTasksByProjectId(projectId);
	const [editingTaskId, setEditingTaskId] = useState<string>("");
	const editTaskMutation = useEditTask(editingTaskId);
	const queryClient = useQueryClient();

	// Transform API tasks into Kanban format
	const tasks: Task[] = (apiTasks ?? [])
		.filter(task => task.selected === true)
		.reduce((acc: Task[], task: Task) => {
			if (task.subtasks && task.subtasks.length > 0) {
				// Task with subtasks becomes its own container
				acc.push({
					...task,
					subtasks: task.subtasks.map((subtask: Task) => ({
						...subtask,
					})),
				});
			} else {
				// Task without subtasks goes to "Others" container
				const othersContainer = acc.find(t => t.id === "others");
				if (othersContainer && othersContainer.subtasks) {
					othersContainer.subtasks.push({
						...task,
					});
				} else {
					acc.push({
						...task,
						id: "others",
						name: "Others",
						subtasks: [{
							...task,
						}],
					});
				}
			}
			// Move "others" container to the end of the array if it exists
			const othersIndex = acc.findIndex(task => task.id === "others");
			if (othersIndex !== -1) {
				const others = acc.splice(othersIndex, 1)[0];
				acc.push(others);
			}
			return acc;
		}, []);

	// Configure the pointer sensor to require a minimum distance before starting drag
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8, // 8px minimum distance before drag starts
			},
		})
	);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		setActiveId(active.id as string);

		// Find the active card
		const card = tasks
			.flatMap((task) => task.subtasks || [])
			.find((subtask) => subtask.id === active.id);
		setActiveCard(card || null);
		setClonedTasks(tasks);
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeCard = tasks
			.flatMap((task) => task.subtasks || [])
			.find((subtask) => subtask.id === active.id);
		if (!activeCard) return;

		const overId = over.id as string;
		const [targetTaskId, targetStatus] = overId.split("=");

		setClonedTasks((currentTasks) => {
			if (!currentTasks) return null;
			const newTasks = [...currentTasks];
			const taskIndex = newTasks.findIndex(
				(task) => task.id === targetTaskId
			);

			if (taskIndex === -1) return currentTasks;

			const subtasks = newTasks[taskIndex].subtasks || [];
			const cardIndex = subtasks.findIndex(
				(subtask) => subtask.id === active.id
			);

			if (cardIndex === -1) return currentTasks;

			const updatedCard = {
				...subtasks[cardIndex],
				status: targetStatus as TaskStatus,
			};

			subtasks[cardIndex] = updatedCard;
			return newTasks;
		});
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) return resetDragState();

		const overId = over.id as string;
		const [, targetStatus] = overId.split("=");

		const updatedCard = clonedTasks
			?.flatMap((task) => task.subtasks || [])
			.find((subtask) => subtask.id === active.id);

		const originalCard = tasks
			.flatMap((task) => task.subtasks || [])
			.find((subtask) => subtask.id === active.id);

		if (!updatedCard || !originalCard || updatedCard.status === originalCard.status) {
			return resetDragState();
		}

		setEditingTaskId(updatedCard.id);

		editTaskMutation.mutate(
			{
				status: updatedCard.status,
				resolution: ["TODO", "IN_PROGRESS"].includes(updatedCard.status)
					? "Unresolved"
					: "Resolved",
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: ["tasks", projectId],
						refetchType: "all",
					});
					toast.success("Cập nhật trạng thái thành công");
					resetDragState();
				},
				onError: () => {
					toast.error("Cập nhật thất bại");
					resetDragState();
				},
			}
		);
	};

	const resetDragState = () => {
		setActiveId(null);
		setActiveCard(null);
		setClonedTasks(null);
	};


	return (
		<div className="flex flex-col h-full gap-8">
			<div className="flex flex-col gap-0.5">
				<p className="text-sm text-gray-500">Kanban Board - {project?.data.key}</p>
				<p className="text-2xl font-bold">{project?.data.name}</p>
			</div>
			<DndContext
				sensors={sensors}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<div className="min-w-[750px]">
					{(clonedTasks || tasks).map((task) => (
						<TaskBoard
							key={task.id}
							task={task}
						/>
					))}
				</div>
				<DragOverlay>
					{activeCard ? (
						<div className="opacity-50">
							<SortableCard card={activeCard} />
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
}
