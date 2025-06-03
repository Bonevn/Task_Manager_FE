"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import { useEffect, useState } from "react";
import { Button } from "@/modules/ui/button";
import { Settings, LogOut, Columns2, Menu, ChevronDown, ChevronUp, Plus, Users } from "lucide-react";
import { Separator } from "@/modules/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
} from "@/modules/ui/sheet";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/modules/ui/dropdownmenu";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/ui/popover";
import { useGetAllProjects } from "@/modules/projects/api";
import NewProjectDialog from "./components/new-project-dialog";
import getImageUrl from "@/lib/get-image-url";
export interface NavbarItems {
	label: string;
	href: string;
}

export interface NavbarTitle {
	title: string;
	href: string;
}

export function Navbar({
	items,
	title,
}: {
	items: NavbarItems[];
	title: NavbarTitle;
}) {
	const router = useRouter();
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const [userName, setUserName] = useState<string | null>(null);
	const [userRole, setUserRole] = useState<string | null>(null);
	const [userPicture, setUserPicture] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isProjectsOpen, setIsProjectsOpen] = useState(false);
	const { data: projectsData, isLoading } = useGetAllProjects();
	const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user) {
			const userData = JSON.parse(user);
			setUserEmail(userData.email);
			setUserName(userData.name);
			setUserRole(userData.role);
			setUserPicture(userData.picture);
		}
	}, []);

	function handleLogout() {
		localStorage.clear();
		router.push("/auth/login");
	}

	const UserMenu = () => (
		<>
			<Link href="/dashboard/user-settings">
				<Button variant="ghost" className="w-full justify-start">
					<Settings className="mr-2 h-4 w-4" />
					Settings
				</Button>
			</Link>
			{userRole === "ADMIN" && (
				<Link href="/dashboard/users">
					<Button variant="ghost" className="w-full justify-start">
						<Users className="mr-2 h-4 w-4" />
						Users
					</Button>
				</Link>
			)}
			<Separator className="my-2" />
			<Button
				variant="ghost"
				className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100"
				onClick={handleLogout}
			>
				<LogOut className="mr-2 h-4 w-4" />
				Logout
			</Button>
		</>
	);

	const ProjectsMenu = () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="flex items-center gap-1">
					Projects
					<ChevronDown className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40" align="start">
				<div className="flex flex-col">
					{isLoading ? (
						<div className="px-2 py-1.5 text-sm text-muted-foreground">Loading...</div>
					) : projectsData?.data?.length ? (
						projectsData.data.map((project) => (
							<Button
								key={project.id}
								variant="ghost"
								className="w-full justify-start"
								onClick={() => {
									router.push(`/dashboard/kanban/${project.id}`);
								}}
							>
								{project.key}
							</Button>
						))
					) : (
						<div className="px-2 py-1.5 text-sm text-muted-foreground">No projects found</div>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);

	return (
		<div className="flex flex-row h-[64px] items-center justify-between p-8 border-b border-b-[1px] sticky top-0 bg-white z-50">
			<Link href={title.href} className="text-xl font-medium">
				{title.title}
			</Link>

			{/* Desktop Menu */}
			<div className="hidden md:flex flex-row items-center gap-6">
				<ProjectsMenu />
				{items.filter(item => item.label !== "Projects").map((item) => (
					<Link key={item.href} href={item.href} className="text-sm">
						{item.label}
					</Link>
				))}
				<Button variant="default" onClick={() => setIsNewProjectDialogOpen(true)}>
					<Plus className="h-4 w-4" />
					New Project
				</Button>
				<Popover>
					<PopoverTrigger asChild>
						<Avatar className="h-8 w-8 cursor-pointer">
							<AvatarImage src={getImageUrl(userPicture || "")} />
							<AvatarFallback>
								{userName?.charAt(0).toUpperCase() || userEmail?.charAt(0).toUpperCase() || "A"}
							</AvatarFallback>
						</Avatar>
					</PopoverTrigger>
					<PopoverContent className="w-40" align="end">
						<UserMenu />
					</PopoverContent>
				</Popover>
			</div>

			{/* Mobile Menu */}
			<div className="md:hidden flex items-center gap-4">
				<Avatar className="h-8 w-8">
					<AvatarImage src={getImageUrl(userPicture || "")} />
					<AvatarFallback>
						{userName?.charAt(0).toUpperCase() || userEmail?.charAt(0).toUpperCase() || "A"}
					</AvatarFallback>
				</Avatar>
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon">
							<Menu className="h-5 w-5" />
							<span className="sr-only">Open menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent
						side="right"
						className="w-[240px] sm:w-[280px]"
					>
						<SheetHeader className="text-left">
							<SheetTitle>Menu</SheetTitle>
						</SheetHeader>
						<div className="flex flex-col gap-4 py-4">
							<ProjectsMenu />
							{items.filter(item => item.label !== "Projects").map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="text-sm px-2 py-1 hover:bg-accent rounded-md"
									onClick={() => setIsOpen(false)}
								>
									{item.label}
								</Link>
							))}
							<Separator className="my-2" />
							<UserMenu />
						</div>
					</SheetContent>
				</Sheet>
			</div>
			<NewProjectDialog
				open={isNewProjectDialogOpen}
				onOpenChange={setIsNewProjectDialogOpen}
			/>
		</div>
	);
}
