import express from "express";
import syllabiRouter from "../routes/syllabiRoutes.js";
import classRouter from "../routes/classRoutes.js";
import assignmentsRouter from "../routes/assignmentsRoutes.js";
import googleRouter from "../routes/googleRoutes.js";

const app = express();

const allowedOrigins = [
  "https://law-bandit-front-end.vercel.app",
  "https://law-bandit-front-end-git-main-jared-leonanos-projects.vercel.app",
  "https://law-bandit-front-r5190cqgm-jared-leonanos-projects.vercel.app",
  "http://localhost:5173",
];

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigins);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, UPDATE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigins);
  return res.json({ ok: true });
});

app.use(express.json());

app.use(classRouter);
app.use(syllabiRouter);
app.use(assignmentsRouter);
app.use(googleRouter);

export default app;
