import { useEffect } from "react";
import { useRoster } from "@/context/RoasterContext";
import RosterTable from "@/components/RosterTable";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const { currentRosters, rosterHistory, loading, fetchCurrentRosters, fetchRosterHistory } = useRoster();

  useEffect(() => {
    fetchCurrentRosters();
    fetchRosterHistory();
  }, [fetchCurrentRosters, fetchRosterHistory]);

  if (loading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-4">Current Week On-Call</h2>

      {currentRosters.length > 0 ? (
        currentRosters.map((roster) => (
          <Card key={`${roster.weekStart}-${roster.team?.name}`} className="mb-4">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground mb-1">Team: {roster.team?.name || "N/A"}</p>
              <p className="text-sm text-muted-foreground mb-1">
                Week: {roster.weekStart}{roster.weekEnd ? ` — ${roster.weekEnd}` : ""}
              </p>
              <p><b>Primary:</b> {roster.primary?.name}</p>
              <p><b>Secondary:</b> {roster.secondary?.name}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">No roster assigned for this week</p>
      )}

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">All Rosters</h3>
      <RosterTable rosters={rosterHistory} />
    </div>
  );
};

export default Dashboard;
