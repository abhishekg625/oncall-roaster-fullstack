import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import rosterRoutes from "./routes/roster.routes";
import userRoutes from "./routes/user.routes";
import teamRoutes from "./routes/team.routes";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/roster", rosterRoutes);

app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);


app.get("/", (_req, res) => {
    res.send("On-call Roaster API running");
});

export default app;
