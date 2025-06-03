"use client";

import Backlog from "@/modules/backlog";
import { useParams } from "next/navigation";

export default function BacklogPage() {
	const params = useParams();
	const projectId = params.projectId as string;

	return <Backlog projectId={projectId} />;
}
