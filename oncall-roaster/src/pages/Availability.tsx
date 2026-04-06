import { useState } from "react";
import { useTeams } from "@/context/TeamContext";
import { useUsers } from "@/context/UserContext";
import type { Team } from "@/types/roaster";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const Availability = () => {
  const { teams, fetchTeams } = useTeams();
  const { users, toggleAvailability } = useUsers();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const [weekStart, setWeekStart] = useState(getMonday());
  const [weekEnd, setWeekEnd] = useState(getSunday(getMonday()));

  const teamMembers = selectedTeam
    ? users.filter(u => selectedTeam.members.some(m => m.id === u.id))
    : [];

  const handleToggle = async (userId: string) => {
    await toggleAvailability(userId);
    await fetchTeams();
  };

  const handleWeekStartChange = (value: string) => {
    setWeekStart(value);
    if (value) {
      setWeekEnd(getSunday(value));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-4">Availability</h2>
      <p className="text-muted-foreground mb-6">Select a week and team, then toggle member availability.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-md">
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

      <p className="text-sm text-muted-foreground mb-4">
        Showing availability for: <span className="font-medium text-foreground">{formatDate(weekStart)} — {formatDate(weekEnd)}</span>
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {teams.map(team => (
          <Button
            key={team._id}
            variant={selectedTeam?._id === team._id ? "default" : "outline"}
            onClick={() => setSelectedTeam(team)}
          >
            {team.name}
          </Button>
        ))}
      </div>

      {selectedTeam ? (
        teamMembers.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Available?</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="text-muted-foreground">{user.name}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={user.isAvailableNextWeek}
                          onCheckedChange={() => handleToggle(user.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isAvailableNextWeek ? "default" : "destructive"}>
                          {user.isAvailableNextWeek ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No members in this team.</p>
        )
      ) : (
        <p className="text-muted-foreground">Select a team to view member availability.</p>
      )}
    </div>
  );
};

export default Availability;
