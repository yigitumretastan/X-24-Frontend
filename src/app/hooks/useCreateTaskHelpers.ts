import { useState, useEffect } from "react";
import { Option, User, Project } from "@/app/types/tasks";
import { fetchUsersFromAPI, fetchProjectsFromAPI } from "@/app/lib/endpoints";

export function useCreateTaskHelpers() {
  const [users, setUsers] = useState<Option[]>([]);
  const [projects, setProjects] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOptions() {
      try {
        setLoading(true);
        setError(null);
        
        const [uData, pData] = await Promise.all([
          fetchUsersFromAPI(),
          fetchProjectsFromAPI(),
        ]);

        setUsers(uData.map((u: User) => ({ value: u.id, label: u.name })));
        setProjects(pData.map((p: Project) => ({ value: p.id, label: p.name })));
      } catch (err) {
        console.error("Options yüklenirken hata:", err);
        setError("Kullanıcılar ve projeler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchOptions();
  }, []);

  return { 
    users, 
    projects, 
    loading, 
    error 
  };
}
