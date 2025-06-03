"use client";
import { useGetTaskOverview } from "@/modules/tasks/api/hooks";
import { TaskStatus } from "@/modules/tasks/api/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";

const COLORS = {
	[TaskStatus.TODO]: "#FFA726", // Orange
	[TaskStatus.IN_PROGRESS]: "#42A5F5", // Blue
	[TaskStatus.DONE]: "#66BB6A", // Green
};

interface ChartDataItem {
	name: string;
	value: number;
}

export function TaskPieChart() {
	const { data: taskOverview, isLoading } = useGetTaskOverview();

	if (isLoading) {
		return (
			<div className="w-full h-[300px] flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
			</div>
		);
	}

	const taskData = taskOverview?.data;

	const chartData = [
		{ name: "TODO", value: taskData?.TODO || 0 },
		{ name: "IN_PROGRESS", value: taskData?.IN_PROGRESS || 0 },
		{ name: "DONE", value: taskData?.DONE || 0 },
	];

	return (
		<div className="w-full h-[300px]">
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={chartData}
						cx="50%"
						cy="50%"
						labelLine={false}
						outerRadius={80}
						fill="#8884d8"
						dataKey="value"
						label={({ name, percent }: { name: string; percent: number }) => 
							`${name} (${(percent * 100).toFixed(0)}%)`
						}
					>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[entry.name.replace(" ", "_") as TaskStatus]} />
						))}
					</Pie>
					<Tooltip />
					<Legend />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}