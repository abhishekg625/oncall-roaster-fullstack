import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { Team } from "../types/roaster";
import API from "../services/api";

type TeamContextType = {
  teams: Team[];
  loading: boolean;
  fetchTeams: () => Promise<void>;
  createTeam: (name: string, memberIds: string[]) => Promise<void>;
  updateTeamMembers: (teamId: string, memberIds: string[]) => Promise<void>;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/teams");
      const formatted = res.data.map((t: any) => ({
        ...t,
        members: t.members.map((m: any) => ({
          id: m.userId,
          name: m.name,
          email: m.email,
          isAvailableNextWeek: m.isAvailableNextWeek ?? true
        }))
      }));
      setTeams(formatted);
    } catch (error) {
      console.error("Failed to fetch teams", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTeam = async (name: string, memberIds: string[]) => {
    await API.post("/teams", { name, members: memberIds });
    await fetchTeams();
  };

  const updateTeamMembers = async (teamId: string, memberIds: string[]) => {
    await API.patch(`/teams/${teamId}/members`, { members: memberIds });
    await fetchTeams();
  };

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return (
    <TeamContext.Provider value={{ teams, loading, fetchTeams, createTeam, updateTeamMembers }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeams = () => {
  const ctx = useContext(TeamContext);
  if (!ctx) {
    throw new Error("useTeams must be used within TeamProvider");
  }
  return ctx;
};
