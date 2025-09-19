import express from "express";
import syllabiRouter from "../routes/syllabiRoutes.js";
import classRouter from "../routes/classRoutes.js";
import assignmentsRouter from "../routes/assignmentsRoutes.js";
import googleRouter from "../routes/googleRoutes.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "https://law-bandit-front-end.vercel.app",
  "https://law-bandit-front-end-git-main-jared-leonanos-projects.vercel.app",
  "https://law-bandit-front-r5190cqgm-jared-leonanos-projects.vercel.app",
  "https://law-bandit-front-r6j2e53u8-jared-leonanos-projects.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(express.json());

app.use(classRouter);
app.use(syllabiRouter);
app.use(assignmentsRouter);
app.use(googleRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

export default app;
