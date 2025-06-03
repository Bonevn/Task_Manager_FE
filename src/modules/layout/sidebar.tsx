"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListTodo, Pencil, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
	label: string;
	href: string;
	icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
	{
		label: "Kanban",
		href: "/dashboard/kanban",
		icon: <LayoutDashboard className="h-5 w-5" />,
	},
	{
		label: "Backlog",
		href: "/dashboard/backlog",
		icon: <ListTodo className="h-5 w-5" />
	},
	{
		label: "Project Users",
		href: "/dashboard/project-users",
		icon: <Users className="h-5 w-5" />
	},
	{
		label: "Settings",
		href: "/dashboard/settings",
		icon: <Settings className="h-5 w-5" />
	}
];

export function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const pathname = usePathname();

	return (
		<div
			className={cn(
				"relative flex flex-col h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300",
				isCollapsed ? "w-12" : "w-48"
			)}
		>
			<div className="flex flex-col flex-1 py-4">
				{sidebarItems.map((item) => {
					const id = pathname.split('/').pop();
					const hasId = id && /^[0-9a-fA-F-]+$/.test(id);
					const href = hasId ? `${item.href}/${id}` : item.href;

					return (
						<Link
							key={item.href}
							href={href}
							className={cn(
								"flex items-center px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100",
								pathname.startsWith(item.href) ? "bg-gray-100" : "",
								isCollapsed ? "justify-center" : ""
							)}
						>
							<span className="flex-shrink-0">{item.icon}</span>
							{!isCollapsed && (
								<span className="ml-3">{item.label}</span>
							)}
						</Link>
					);
				})}
			</div>
			<button
				onClick={() => setIsCollapsed(!isCollapsed)}
				className="flex items-center justify-center p-2 hover:bg-gray-100"
			>
				<svg
					className={cn(
						"h-5 w-5 transform transition-transform",
						isCollapsed ? "rotate-180" : ""
					)}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>
		</div>
	);
}
