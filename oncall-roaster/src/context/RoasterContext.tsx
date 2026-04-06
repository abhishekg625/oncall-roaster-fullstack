import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Roster } from "../types/roaster";
import API from "../services/api";

type RosterContextType = {
  currentRosters: Roster[];
  rosterHistory: Roster[];
  loading: boolean;
  fetchCurrentRosters: (teamId?: string) => Promise<void>;
  fetchRosterHistory: (teamId?: string) => Promise<void>;
  createRoster: (weekStart: string, weekEnd: string, primaryId: string, secondaryId: string, teamId: string) => Promise<void>;
};

const RosterContext = createContext<RosterContextType | undefined>(undefined);

export const RosterProvider = ({ children }: { children: ReactNode }) => {
  const [currentRosters, setCurrentRosters] = useState<Roster[]>([]);
  const [rosterHistory, setRosterHistory] = useState<Roster[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCurrentRosters = useCallback(async (teamId?: string) => {
    try {
      setLoading(true);
      const params = teamId ? { team: teamId } : {};
      const res = await API.get("/roster/current", { params });
      setCurrentRosters(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
    } catch (error) {
      console.error("Failed to fetch current roster", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRosterHistory = useCallback(async (teamId?: string) => {
    try {
      setLoading(true);
      const params = teamId ? { team: teamId } : {};
      const res = await API.get("/roster/history", { params });
      setRosterHistory(res.data);
    } catch (error) {
      console.error("Failed to fetch roster history", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoster = async (weekStart: string, weekEnd: string, primaryId: string, secondaryId: string, teamId: string) => {
    await API.post("/roster", {
      weekStart,
      weekEnd,
      primary: primaryId,
      secondary: secondaryId,
      team: teamId
    });
    await fetchCurrentRosters();
    await fetchRosterHistory();
  };

  return (
    <RosterContext.Provider value={{
      currentRosters,
      rosterHistory,
      loading,
      fetchCurrentRosters,
      fetchRosterHistory,
      createRoster
    }}>
      {children}
    </RosterContext.Provider>
  );
};

export const useRoster = () => {
  const ctx = useContext(RosterContext);
  if (!ctx) {
    throw new Error("useRoster must be used inside RosterProvider");
  }
  return ctx;
};
