"use client";
import ProjectUsers from "@/modules/project-users";
import { useParams } from "next/navigation";

export default function ProjectUsersPage() {
	const { projectId } = useParams();
	return <ProjectUsers projectId={projectId as string} />;
}