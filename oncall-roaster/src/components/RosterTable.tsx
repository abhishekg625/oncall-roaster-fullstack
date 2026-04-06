import type { Roster } from "@/types/roaster";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  rosters: Roster[];
};

const RosterTable = ({ rosters }: Props) => {
  if (!rosters.length)
    return <p className="text-muted-foreground">No roster created yet</p>;

  return (
    <div className="overflow-x-auto">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Week</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Primary</TableHead>
              <TableHead>Secondary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rosters.map((r) => (
              <TableRow key={`${r.weekStart}-${r.team?.name}`}>
                <TableCell className="text-muted-foreground">
                  {r.weekEnd ? `${r.weekStart} — ${r.weekEnd}` : r.weekStart}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {r.team?.name || "N/A"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {r.primary?.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {r.secondary?.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RosterTable;
