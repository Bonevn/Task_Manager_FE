import React from "react";

export interface TaskDetailBodyItemProps {
	title: string;
	items: { key: string; value: React.ReactNode }[];
}

export default function TaskDetailBodyItem({ title, items }: TaskDetailBodyItemProps) {
	return (
		<div className="flex flex-col gap-3">
			<p className="text-lg font-bold">{title}</p>
			<div className="grid grid-cols-2 gap-2">
				{items.map((item, index) => (
					<React.Fragment key={index}>
						<p className="text-md text-gray-500">{item.key}:</p>
						{item.value}
					</React.Fragment>
				))}
			</div>
		</div>
	);
}