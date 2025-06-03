"use client";
import {
	DndContext,
	DragOverlay,
	DragStartEvent,
	DragEndEvent,
	DragOverEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Container } from "./components/Container";
import { SortableItem } from "./components/SortableItem";
import { useGetTasksByProjectId, useEditTask, useCreateTask } from "../tasks/api/hooks";
import { Task, TaskPriority } from "../tasks/api/types";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import TaskCreateDialog from "../task-detail/components/task-create-dialog";
import { toast } from "sonner";
import { useGetProjectById } from "../projects/api/hooks";
interface BacklogProps {
	projectId: string;
}

interface Item {
	id: string;
	title: string;
	status: "selected" | "backlog";
}

type ItemsRecord = Record<string, Task[]>;

export default function Backlog({ projectId }: BacklogProps) {
	const { data: project } = useGetProjectById(projectId);
	const { data: tasks, refetch } = useGetTasksByProjectId(projectId);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [activeItem, setActiveItem] = useState<Task | null>(null);
	const [initialActiveContainer, setInitialActiveContainer] = useState<string | null>(null);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [clonedItems, setClonedItems] = useState<ItemsRecord | null>(null);
	const [taskToEdit, setTaskToEdit] = useState<string | null>(null);
	const editTaskMutation = useEditTask(taskToEdit || '');
	const createTaskMutation = useCreateTask();
	const items = useMemo<ItemsRecord>(() => {
		if (clonedItems) {
			return clonedItems;
		}
		if (tasks) {
			return {
				selected: tasks.filter((t) => t.selected),
				backlog: tasks.filter((t) => !t.selected),
			};
		}
		return { selected: [], backlog: [] };
	}, [tasks, clonedItems]);

	// Add effect to handle mutation success
	useEffect(() => {
		if (editTaskMutation.isSuccess) {
			refetch();
			setClonedItems(null);
		}
	}, [editTaskMutation.isSuccess, refetch]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		setActiveId(active.id as string);

		// Find the active item
		const item = Object.values(items)
			.flat()
			.find((item: Task) => item.id === active.id);
		setActiveItem(item || null);
		// Store the initial container
		setInitialActiveContainer(item?.selected ? "selected" : "backlog");
		// Reset clonedItems before starting new drag
		setClonedItems(items); // Optimistic UI clone
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over || !initialActiveContainer) {
			setClonedItems(null);
			return;
		}

		const overContainer =
			over.data?.current?.type === "container"
				? over.id
				: Object.values(items).flat().find((item: Task) => item.id === over.id)?.selected ? "selected" : "backlog";

		if (!overContainer || initialActiveContainer === overContainer) {
			setClonedItems(null);
			return;
		}
		setClonedItems((prev) => {
			if (!prev) return items; // If no previous state, use current items
			const activeItems = prev[initialActiveContainer] || [];
			const overItems = prev[overContainer] || [];
			const activeIndex = activeItems.findIndex((item) => item?.id === active.id);
			const overIndex = overItems.findIndex((item) => item?.id === over.id);
			let newIndex: number;
			if (over.id in prev) {
				newIndex = overItems.length + 1;
			} else {
				const isBelowOverItem =
					over &&
					active.rect.current.translated &&
					active.rect.current.translated.top > over.rect.top + over.rect.height;
				const modifier = isBelowOverItem ? 1 : 0;
				newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
			}
			const movedTask = { ...activeItems[activeIndex], selected: overContainer === "selected" };
			return {
				...prev,
				[initialActiveContainer]: activeItems.filter((item) => item?.id !== active.id),
				[overContainer]: [
					...overItems.slice(0, newIndex),
					movedTask,
					...overItems.slice(newIndex),
				],
			};
		});
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || !initialActiveContainer) {
			setActiveId(null);
			setActiveItem(null);
			setInitialActiveContainer(null);
			setClonedItems(null);
			return;
		}

		const activeTask = Object.values(items).flat().find((item) => item.id === active.id);
		if (!activeTask) {
			setActiveId(null);
			setActiveItem(null);
			setInitialActiveContainer(null);
			setClonedItems(null);
			return;
		}

		const overContainer =
			over.data?.current?.type === "container"
				? over.id
				: Object.values(items).flat().find((item: Task) => item.id === over.id)?.selected ? "selected" : "backlog";

		if (!overContainer) {
			setActiveId(null);
			setActiveItem(null);
			setInitialActiveContainer(null);
			setClonedItems(null);
			return;
		}

		// Only update if moved between containers
		if (initialActiveContainer !== overContainer) {
			const newSelected = overContainer === "selected";
			if (activeTask.selected !== newSelected) {
				// Create optimistic update
				const newState = {
					selected: items.selected.filter(item => item.id !== active.id),
					backlog: items.backlog.filter(item => item.id !== active.id)
				};

				// Add to target container
				const movedTask = { ...activeTask, selected: newSelected };
				if (newSelected) {
					newState.selected = [...newState.selected, movedTask];
				} else {
					newState.backlog = [...newState.backlog, movedTask];
				}

				setClonedItems(newState);
				setTaskToEdit(activeTask.id);
				editTaskMutation.mutate(
					{ selected: newSelected },
					{
						onError: () => {
							// Revert optimistic update on error
							setClonedItems(null);
							toast.error("Failed to move task");
						},
						onSuccess: () => {
							toast.success("Task moved successfully");
						}
					}
				);
			}
		}

		setActiveId(null);
		setActiveItem(null);
		setInitialActiveContainer(null);
	};

	const handleCreateTask = (task: Omit<Task, 'id' | 'sequence' | 'projectId' | 'status' | 'reporterId' | 'createdById' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'project' | 'assignee' | 'reporter' | 'subtasks' | 'comments'>) => {
		createTaskMutation.mutate(task, {
			onSuccess: () => {
				toast.success("Task created successfully");
			},
			onError: (error) => {
				toast.error("Failed to create task: " + error.message);
			}
		});
		setIsCreateDialogOpen(false);
	};

	return (
		<div className="flex flex-col h-full gap-8">
			<div className="flex flex-row justify-between items-center">
				<div className="flex flex-col gap-0.5">
					<p className="text-sm text-gray-500">Backlog Board - {project?.data.key}</p>
					<p className="text-2xl font-bold">{project?.data.name}</p>
				</div>
				<TaskCreateDialog
					buttonText="Add Task"
					buttonIcon={<PlusIcon className="w-4 h-4" />}
					open={isCreateDialogOpen}
					onOpenChange={setIsCreateDialogOpen}
					onCreate={handleCreateTask}
					projectId={projectId}
				/>
			</div>
			<DndContext
				sensors={sensors}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragOver={handleDragOver}
			>
				<div className="space-y-4">
					<Container
						id="selected"
						items={items.selected}
						title="Selected"
					/>
					<Container
						id="backlog"
						items={items.backlog}
						title="Backlog"
					/>
				</div>
				<DragOverlay>
					{activeItem ? <SortableItem task={activeItem} /> : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
}

// Helper function to move items in an array
function arrayMove<T>(array: T[], from: number, to: number): T[] {
	const newArray = [...array];
	const [movedItem] = newArray.splice(from, 1);
	newArray.splice(to, 0, movedItem);
	return newArray;
}
