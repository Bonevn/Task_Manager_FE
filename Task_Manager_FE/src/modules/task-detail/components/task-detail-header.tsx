import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/modules/ui/breadcrumb";

interface TaskDetailHeaderProps {
	taskDescription: string;
    projectName: string;
    projectId: string;
}

export default function TaskDetailHeader({
	taskDescription,
	projectName,
	projectId,
}: TaskDetailHeaderProps) {
	return (
		<div className="flex flex-row gap-3">
			<div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center border border-black border-3">
				<div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
					<div className="w-4 h-4 bg-white rounded-full flex items-center justify-center"></div>
				</div>
			</div>
			<div className="flex flex-col justify-between">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/dashboard">
								Dashboard
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href={`/dashboard/kanban/${projectId}`}>
								{projectName}
							</BreadcrumbLink>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<p className="text-xl font-bold leading-6">{taskDescription}</p>
			</div>
		</div>
	);
}
