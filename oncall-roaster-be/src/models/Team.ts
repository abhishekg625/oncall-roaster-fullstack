import { Schema, model, Document, Types } from "mongoose";

export interface ITeam extends Document {
  name: string;
  members: Types.ObjectId[];
  createdBy: Types.ObjectId;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const Team = model<ITeam>("Team", teamSchema);

export default Team;
