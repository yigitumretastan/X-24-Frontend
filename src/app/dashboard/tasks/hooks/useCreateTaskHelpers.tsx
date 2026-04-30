import { useCallback, useEffect, useState } from "react";
import { usePostApiProjectsList } from "@/api/generated/projects/projects";
import { useGetWorkspaceUsers } from "@/api/generated/workspace-users/workspace-users";
import type {
	LoadOptionsDto,
	LoadResult,
	ProjectDto,
	WorkspaceUserDto,
} from "@/api/model";

export interface Option {
	value: string;
	label: string;
}

export function useCreateTaskHelpers(workspaceId: number) {
	const { data: usersResponse } = useGetWorkspaceUsers({
		WorkspaceId: workspaceId.toString(),
	});
	const { mutate: fetchProjectsList, data: projectsResponse } =
		usePostApiProjectsList();
	const [projectOptions, setProjectOptions] = useState<Option[]>([]);

	const fetchProjects = useCallback(() => {
		fetchProjectsList({
			data: {
				requireTotalCount: false,
				skip: 0,
				take: 100,
			} as LoadOptionsDto,
		});
	}, [fetchProjectsList]);

	useEffect(() => {
		fetchProjects();
	}, [fetchProjects]);

	useEffect(() => {
		if (projectsResponse?.data) {
			const loadResult = projectsResponse.data as LoadResult;
			const mappedProjects = ((loadResult.data as ProjectDto[]) || []).map(
				(p) => ({
					value: p.id?.toString() || "",
					label: p.name || "",
				}),
			);
			setProjectOptions(mappedProjects);
		}
	}, [projectsResponse]);

	const users: Option[] = (
		(usersResponse?.data as WorkspaceUserDto[]) || []
	).map((u) => ({
		value: u.id?.toString() || "",
		label: u.email || "Bilinmeyen Kullanıcı",
	}));

	return { users, projects: projectOptions };
}
