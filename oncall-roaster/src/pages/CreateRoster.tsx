import { useEffect, useState } from "react";
import { useTeams } from "@/context/TeamContext";
import { useRoster } from "@/context/RoasterContext";
import type { Team } from "@/types/roaster";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const getMonday = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().slice(0, 10);
};

const getSunday = (mondayStr: string) => {
  const d = new Date(mondayStr + "T00:00:00");
  d.setDate(d.getDate() + 6);
  return d.toISOString().slice(0, 10);
};

const CreateRoster = () => {
  const [weekStart, setWeekStart] = useState(getMonday());
  const [weekEnd, setWeekEnd] = useState(getSunday(getMonday()));
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [primaryId, setPrimaryId] = useState("");
  const [secondaryId, setSecondaryId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { teams } = useTeams();
  const { createRoster } = useRoster();

  const availableMembers = selectedTeam
    ? selectedTeam.members.filter(m => m.isAvailableNextWeek !== false)
    : [];

  useEffect(() => {
    setPrimaryId("");
    setSecondaryId("");
  }, [selectedTeam]);

  const handleWeekStartChange = (value: string) => {
    setWeekStart(value);
    if (value) {
      setWeekEnd(getSunday(value));
    }
  };

  const handleTeamChange = (teamId: string) => {
    const team = teams.find(t => t._id === teamId) || null;
    setSelectedTeam(team);
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!selectedTeam) {
      setError("Select a team");
      return;
    }
    if (!weekStart || !weekEnd) {
      setError("Select a date range");
      return;
    }
    if (weekEnd <= weekStart) {
      setError("End date must be after start date");
      return;
    }
    if (!primaryId || !secondaryId) {
      setError("Select both on-call persons");
      return;
    }
    if (primaryId === secondaryId) {
      setError("Primary and Secondary cannot be the same");
      return;
    }

    try {
      await createRoster(weekStart, weekEnd, primaryId, secondaryId, selectedTeam._id);
      setSuccess("Roster created successfully");
      setPrimaryId("");
      setSecondaryId("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create roster");
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-foreground mb-6">Create Weekly Roster</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Roster Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-destructive text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Week Start</Label>
              <Input
                type="date"
                value={weekStart}
                onChange={(e) => handleWeekStartChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Week End</Label>
              <Input
                type="date"
                value={weekEnd}
                onChange={(e) => setWeekEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Team</Label>
            <Select value={selectedTeam?._id ?? ""} onValueChange={handleTeamChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(t => (
                  <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Primary On-call</Label>
            <Select value={primaryId} onValueChange={setPrimaryId} disabled={!selectedTeam}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {availableMembers.map(u => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Secondary On-call</Label>
            <Select value={secondaryId} onValueChange={setSecondaryId} disabled={!selectedTeam}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {availableMembers.map(u => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" onClick={handleSave}>
            Save Roster
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRoster;
