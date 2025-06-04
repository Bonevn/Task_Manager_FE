"use client";
import React from "react";
import { Navbar, NavbarItems, NavbarTitle } from "@/modules/layout/navbar";
import { Sidebar } from "@/modules/layout/sidebar";
import { TaskDetailsSidebar } from "@/modules/layout/task-details-sidebar";
import { TaskProvider, useTask } from "@/contexts/task-context";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useAuthCheck } from "@/hooks/use-auth-check";

const navbarItems: NavbarItems[] = [
	{ label: "Projects", href: "/dashboard/projects" },
];

const navbarTitle: NavbarTitle = {
	title: "Task Manager",
	href: "/dashboard",
};

interface DashboardLayoutProps {
	children: React.ReactElement;
}

function DashboardContent({ children }: DashboardLayoutProps) {
	const { selectedCard, isTaskDetailsOpen, handleClose } = useTask();
	const pathname = usePathname();
	const isDashboardRoot = (pathname === "/dashboard" || pathname.includes("/dashboard/task/") || pathname.includes("/dashboard/user"));
	useAuthCheck();

	return (
		<div className="flex flex-col h-screen">
			<Navbar items={navbarItems} title={navbarTitle} />
			<div className="flex flex-1 h-[calc(100vh-4rem)]">
				{!isDashboardRoot && <Sidebar />}
				<div className={cn(
					"flex-1 p-8 overflow-auto",
					isTaskDetailsOpen ? "w-[calc(100%-400px)]" : "w-full"
				)}>
					<div className="min-w-[750px]">
						{children}
					</div>
				</div>
				{isTaskDetailsOpen && selectedCard && (
					<TaskDetailsSidebar
						isOpen={isTaskDetailsOpen}
						onClose={handleClose}
						taskId={selectedCard.id}
					/>
				)}
			</div>
		</div>
	);
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<TaskProvider>
			<DashboardContent>{children}</DashboardContent>
		</TaskProvider>
	);
}
