"use client";
import ProjectSettings from "@/modules/project-settings";
import { useParams } from "next/navigation";

export default function ProjectSettingsPage() {
    const params = useParams();
    const projectId = params.projectId as string;
    return <ProjectSettings projectId={projectId} />;
}