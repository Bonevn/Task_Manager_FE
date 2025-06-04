"use client";
import { useGetProjectProgress } from "@/modules/projects/api/hooks";
import { ProjectProgress } from "@/modules/projects/api/types";
import { Progress } from "@/modules/ui/progress";
import { useEffect } from "react";

export function ProjectProgressDashboard() {
    const { data: projectProgress, isLoading } = useGetProjectProgress();

    const calculateProgress = (project: ProjectProgress) => {
        const total = project.TODO + project.IN_PROGRESS + project.DONE;
        if (total === 0) return 0;
        return Number(((project.DONE / total) * 100).toFixed(1));
    }

    useEffect(() => {
        projectProgress?.data?.forEach((project) => {
            const progress = calculateProgress(project);
            console.log(progress);
        });
    }, [projectProgress]);

	return (
        <div>
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Project Progress</h1>
                </div>
                {projectProgress?.data?.map((project) => (
                    <div key={project.projectId} className="flex flex-col gap-2">
                        <div className="flex flex-row justify-between">
                            <div className="text-md font-bold">{project.projectKey}</div>
                            <div className="text-md font-bold">{calculateProgress(project)}% Done</div>
                        </div>
                        <Progress value={calculateProgress(project)} className="h-2" />
                    </div>
                ))}
            </div>
        </div>
    );
}