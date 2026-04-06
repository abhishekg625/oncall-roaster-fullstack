export type User = {
  id: string;
  name: string;
  email?: string;
  role?: string;
  isAvailableNextWeek?: boolean;
};

export type Team = {
  _id: string;
  name: string;
  members: User[];
  createdBy?: { _id: string; name: string };
};

export type Roster = {
  weekStart: string;
  weekEnd?: string;
  primary: User;
  secondary: User;
  team: { name: string };
  createdAt: string;
};
