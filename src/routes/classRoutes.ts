import express from "express";
import {
  createClass,
  deleteClass,
  getClasses,
  updateClass,
} from "../queries/classQueries.js";

const classRouter = express.Router();

classRouter.post("/createClass", async (req, res) => {
  const authHeader = req.headers.authorization;
  const { title } = req.body;
  try {
    const createdClass = await createClass(authHeader!, title);

    res.send(createdClass);
  } catch (error) {
    console.error("Error creating class:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

classRouter.get("/getClasses", async (req, res) => {
  const authHeader = req.headers.authorization;
  try {
    const retrievedClasses = await getClasses(authHeader!);

    res.send(retrievedClasses);
  } catch (error) {
    console.error("Error retrieving classes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

classRouter.put("/updateClass/:class_id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const classId = req.params.class_id;
  const { class_title } = req.body;

  try {
    const updatedClass = await updateClass(authHeader!, classId, class_title);

    res.send(updatedClass);
  } catch (error) {
    console.error("Error updating class:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

classRouter.delete("/deleteClass/:class_id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const syllabusId = req.params.class_id;

  try {
    const deletedSyllabus = await deleteClass(authHeader!, syllabusId);
    res.send(deletedSyllabus);
  } catch (error) {
    console.error("Error deleting class:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default classRouter;
