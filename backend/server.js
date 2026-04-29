require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(","),
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/profile", profileRoutes);

app.use((err, req, res, _next) => {
  console.error("[unhandled]", err);
  res.status(500).json({ error: "Internal server error." });
});

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] http://localhost:${PORT}`);
  });
})();
