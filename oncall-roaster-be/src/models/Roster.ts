import { Schema, model, Document, Types } from "mongoose";

export interface IRoster extends Document {
  weekStart: string;
  weekEnd: string;
  primary: Types.ObjectId;
  secondary: Types.ObjectId;
  team: Types.ObjectId;
  createdBy: Types.ObjectId;
}

const rosterSchema = new Schema<IRoster>(
  {
    weekStart: { type: String, required: true },
    weekEnd: { type: String, required: true },
    primary: { type: Schema.Types.ObjectId, ref: "User", required: true },
    secondary: { type: Schema.Types.ObjectId, ref: "User", required: true },
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

rosterSchema.index({ weekStart: 1, team: 1 }, { unique: true });

const Roster = model<IRoster>("Roster", rosterSchema);

export default Roster;
