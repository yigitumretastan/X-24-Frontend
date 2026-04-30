import { useEffect, useState } from "react";
import { usePostApiProjectsList } from "@/api/generated/projects/projects";
import { useGetWorkspaceUsers } from "@/api/generated/workspace-users/workspace-users";
import type { Option } from "@/app/types/tasks";

export function useCreateTaskHelpers() {
	const [users, setUsers] = useState<Option[]>([]);
	const [projects, setProjects] = useState<Option[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const usersQuery = useGetWorkspaceUsers();
	const projectsMutation = usePostApiProjectsList();

	useEffect(() => {
		async function fetchOptions() {
			try {
				setLoading(true);
				setError(null);

				// Fetch users (GET query) and projects (POST mutation for list)
				const [usersResponse, projectsResponse] = await Promise.all([
					usersQuery.refetch(),
					projectsMutation.mutateAsync({ data: { take: 100, skip: 0 } }),
				]);

				if (usersResponse.data?.data) {
					setUsers(
						usersResponse.data.data.map((u) => ({
							value: u.id || "",
							label: u.email || "Unknown User",
						})),
					);
				}

				if (
					projectsResponse.status === 200 &&
					(projectsResponse.data as { data?: unknown[] })?.data
				) {
					setProjects(
						(
							projectsResponse.data as {
								data: { id?: string; name?: string }[];
							}
						).data.map((p) => ({
							value: p.id || "",
							label: p.name || "Unnamed Project",
						})),
					);
				}
			} catch (err) {
				console.error("Options yüklenirken hata:", err);
				setError("Kullanıcılar ve projeler yüklenirken bir hata oluştu.");
			} finally {
				setLoading(false);
			}
		}

		fetchOptions();
	}, [usersQuery.refetch, projectsMutation.mutateAsync]);

	return {
		users,
		projects,
		loading,
		error,
	};
}
