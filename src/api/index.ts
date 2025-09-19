import express from "express";
import cors from "cors";
import syllabiRouter from "../routes/syllabiRoutes.js";
import classRouter from "../routes/classRoutes.js";
import assignmentsRouter from "../routes/assignmentsRoutes.js";
import googleRouter from "../routes/googleRoutes.js";

const app = express();
app.use(cors());

const FRONTEND_URL = "http://law-bandit-front-end.vercel.app";
const DEV_ORIGIN = "http://localhost:5173";
const allowedOrigins = [FRONTEND_URL, DEV_ORIGIN];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy: origin not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin!)) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.use(classRouter);
app.use(syllabiRouter);
app.use(assignmentsRouter);
app.use(googleRouter);

export default app;
