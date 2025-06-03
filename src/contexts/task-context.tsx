"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "@/modules/tasks/api/types";

interface TaskContextType {
	selectedCard: Task | null;
	isTaskDetailsOpen: boolean;
	handleTaskClick: (card: Task) => void;
	handleClose: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
	const [selectedCard, setSelectedCard] = useState<Task | null>(null);
	const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);

	const handleTaskClick = (card: Task) => {
		console.log("Task clicked in context:", card);
		setSelectedCard(card);
		setIsTaskDetailsOpen(true);
	};

	const handleClose = () => {
		console.log("Closing task details in context");
		setSelectedCard(null);
		setIsTaskDetailsOpen(false);
	};

	return (
		<TaskContext.Provider
			value={{
				selectedCard,
				isTaskDetailsOpen,
				handleTaskClick,
				handleClose,
			}}
		>
			{children}
		</TaskContext.Provider>
	);
}

export function useTask() {
	const context = useContext(TaskContext);
	if (context === undefined) {
		throw new Error("useTask must be used within a TaskProvider");
	}
	return context;
}
