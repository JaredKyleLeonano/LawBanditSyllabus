import express from "express";
import cors from "cors";
import syllabiRouter from "../routes/syllabiRoutes.js";
import classRouter from "../routes/classRoutes.js";
import assignmentsRouter from "../routes/assignmentsRoutes.js";
import googleRouter from "../routes/googleRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(classRouter);
app.use(syllabiRouter);
app.use(assignmentsRouter);
app.use(googleRouter);

export default app;
