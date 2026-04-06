import { useState } from "react";
import { useTeams } from "@/context/TeamContext";
import { useUsers } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import type { Team } from "@/types/roaster";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Teams = () => {
  const { teams, createTeam, updateTeamMembers } = useTeams();
  const { users } = useUsers();
  const { user } = useAuth();

  const [teamName, setTeamName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editMembers, setEditMembers] = useState<string[]>([]);
  const [editError, setEditError] = useState("");

  const isAdmin = user?.role === "admin";

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleEditMember = (userId: string) => {
    setEditMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    try {
      setError("");
      setSuccess("");
      if (!teamName.trim()) {
        setError("Team name is required");
        return;
      }
      if (selectedMembers.length === 0) {
        setError("Select at least one member");
        return;
      }
      await createTeam(teamName.trim(), selectedMembers);
      setTeamName("");
      setSelectedMembers([]);
      setSuccess("Team created successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create team");
    }
  };

  const startEditing = (team: Team) => {
    setEditingTeam(team);
    setEditMembers(team.members.map(m => m.id));
    setEditError("");
  };

  const cancelEditing = () => {
    setEditingTeam(null);
    setEditMembers([]);
    setEditError("");
  };

  const saveMembers = async () => {
    if (!editingTeam) return;
    if (editMembers.length === 0) {
      setEditError("Team must have at least one member");
      return;
    }
    try {
      setEditError("");
      await updateTeamMembers(editingTeam._id, editMembers);
      setEditingTeam(null);
      setEditMembers([]);
    } catch (err: any) {
      setEditError(err.response?.data?.message || "Failed to update team");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Teams</h2>

      {isAdmin && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Create New Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-destructive text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <Input
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />

            <div>
              <Label className="mb-2 text-muted-foreground">Select Members:</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto mt-2">
                {users.map(u => (
                  <Label
                    key={u.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer font-normal"
                  >
                    <Checkbox
                      checked={selectedMembers.includes(u.id)}
                      onCheckedChange={() => toggleMember(u.id)}
                    />
                    <span className="text-sm text-foreground">{u.name}</span>
                  </Label>
                ))}
              </div>
            </div>

            <Button variant="default" onClick={handleCreate}>
              Create Team
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {teams.length === 0 && (
          <p className="text-muted-foreground">No teams created yet.</p>
        )}
        {teams.map(team => (
          <Card key={team._id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg text-foreground">{team.name}</CardTitle>
              {isAdmin && editingTeam?._id !== team._id && (
                <Button variant="outline" size="sm" onClick={() => startEditing(team)}>
                  Manage Members
                </Button>
              )}
            </CardHeader>

            <CardContent>
              {editingTeam?._id === team._id ? (
                <div className="space-y-4">
                  {editError && (
                    <p className="text-destructive text-sm">{editError}</p>
                  )}
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {users.map(u => (
                      <Label
                        key={u.id}
                        className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer font-normal"
                      >
                        <Checkbox
                          checked={editMembers.includes(u.id)}
                          onCheckedChange={() => toggleEditMember(u.id)}
                        />
                        <span className="text-sm text-foreground">{u.name}</span>
                      </Label>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={saveMembers}>
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {team.members.map(member => (
                    <Badge key={member.id} variant="secondary">
                      {member.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Teams;
