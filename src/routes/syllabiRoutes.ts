import { extractAssignments } from "../ai/aiClient.js";
import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import {
  getSyllabi,
  uploadSyllabus,
  updateSyllabus,
  deleteSyllabus,
} from "../queries/syllabiQueries.js";
import { ExtractedAssignmentType, SyllabusType } from "../types.js";
import { uploadAssignments } from "../queries/assignmentsQueries.js";
import syllabusColorChooser from "../helpers/syllabusColorChooser.js";
import {
  createCalendarEvent,
  deleteCalendar,
  getUserTokens,
  updateAccessToken,
  updateCalendar,
} from "../queries/googleQueries.js";
import { refreshAccessToken } from "../helpers/googleTokens.js";
import { createCalendar, insertCalendar } from "../queries/googleQueries.js";
import normalizeDate from "../helpers/normalizeDate.js";
import {
  connectClassSyllabus,
  disconnectClassSyllabus,
} from "../queries/classQueries.js";

const syllabiRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

syllabiRouter.get("/getSyllabi", async (req, res) => {
  const authHeader = req.headers.authorization;
  try {
    const syllabi = await getSyllabi(authHeader!);
    res.send(syllabi);
  } catch (error) {
    console.error("Error retrieving syllabi:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

syllabiRouter.post(
  "/uploadSyllabus",
  upload.single("pdf"),
  async (req, res) => {
    const authHeader = req.headers.authorization;
    const pdf = req.file!.buffer;
    const { classId, isGoogle, user_id } = req.body;
    const parsedPdf = await pdfParse(pdf);
    const extractedSyllabus: SyllabusType = await extractAssignments(
      parsedPdf.text
    );

    let color;
    let insertedSyllabus: SyllabusType[];
    let assignmentsToInsert = [];

    try {
      if (isGoogle != "true") {
        color = await syllabusColorChooser();
        insertedSyllabus = await uploadSyllabus(
          authHeader!,
          classId,
          extractedSyllabus.title,
          color
        );

        assignmentsToInsert = extractedSyllabus.assignments.map(
          (assignment: ExtractedAssignmentType) => ({
            syllabus_id: insertedSyllabus[0].id,
            title: assignment.title,
            subtitle: assignment.subtitle,
            start: `${assignment.deadline}T${assignment.start}`,
            end: `${assignment.deadline}T${assignment.end}`,
            event_id: null,
          })
        );
      } else {
        let retrievedTokens = await getUserTokens(authHeader!, user_id);

        let provider_token = retrievedTokens[0].provider_token;
        const refresh_token = retrievedTokens[0].refresh_token;

        let createdCalendar = await createCalendar(
          provider_token!,
          extractedSyllabus.title
        );

        if (createdCalendar.error?.code === 401 && refresh_token) {
          const refreshed = await refreshAccessToken(refresh_token);
          provider_token = refreshed.access_token;
          await updateAccessToken(authHeader!, user_id, provider_token);
          createdCalendar = await createCalendar(
            provider_token!,
            extractedSyllabus.title
          );
        }

        let insertedCalendar = await insertCalendar(
          provider_token,
          createdCalendar.id
        );

        if (insertedCalendar.error?.code === 401 && refresh_token) {
          const refreshed = await refreshAccessToken(refresh_token);
          provider_token = refreshed.access_token;
          await updateAccessToken(authHeader!, user_id, provider_token);

          insertedCalendar = await insertCalendar(
            provider_token,
            createdCalendar.id
          );
        }

        insertedSyllabus = await uploadSyllabus(
          authHeader!,
          classId,
          extractedSyllabus.title,
          insertedCalendar.backgroundColor,
          createdCalendar.id
        );

        for (const assignment of extractedSyllabus.assignments) {
          const newAssignment = {
            syllabus_id: insertedSyllabus[0].id,
            title: assignment.title,
            subtitle: assignment.subtitle,
            start: `${assignment.deadline}T${assignment.start}`,
            end: `${assignment.deadline}T${assignment.end}`,
            event_id: null,
          };

          assignmentsToInsert.push(newAssignment);

          const event = {
            summary: newAssignment.title,
            description: newAssignment.subtitle,
            start: {
              dateTime: normalizeDate(newAssignment.start),
            },
            end: {
              dateTime: normalizeDate(newAssignment.end),
            },
          };

          let createdEvent = await createCalendarEvent(
            provider_token,
            createdCalendar.id,
            event
          );

          if (createdEvent.error?.code === 401 && refresh_token) {
            const refreshed = await refreshAccessToken(refresh_token);
            provider_token = refreshed.access_token;
            await updateAccessToken(authHeader!, user_id, provider_token);

            createdEvent = await createCalendarEvent(
              provider_token,
              createdCalendar.id,
              event
            );
          }

          newAssignment.event_id = createdEvent.id;
        }
      }

      await uploadAssignments(authHeader!, assignmentsToInsert);
      await connectClassSyllabus(
        authHeader!,
        classId,
        insertedSyllabus[0].id.toString()
      );

      res.send({
        syllabus_title: extractedSyllabus.title,
        assignments: assignmentsToInsert,
      });
    } catch (error) {
      console.error("Error uploading syllabus:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

syllabiRouter.put("/updateSyllabus/:syllabus_id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const syllabusId = req.params.syllabus_id;
  const { calendar_id, user_id, syllabus_title } = req.body;

  try {
    const updatedSyllabus = await updateSyllabus(
      authHeader!,
      syllabusId,
      syllabus_title
    );

    if (calendar_id) {
      let retrievedTokens = await getUserTokens(authHeader!, user_id);

      let provider_token = retrievedTokens[0].provider_token;
      const refresh_token = retrievedTokens[0].refresh_token;

      let updatedCalendar = await updateCalendar(
        provider_token,
        calendar_id,
        syllabus_title
      );

      if (updatedCalendar.error?.code === 401 && refresh_token) {
        const refreshed = await refreshAccessToken(refresh_token);
        provider_token = refreshed.access_token;
        await updateAccessToken(authHeader!, user_id, provider_token);
        updatedCalendar = await updateCalendar(
          provider_token,
          calendar_id,
          syllabus_title
        );
      }
    }

    res.send(updatedSyllabus);
  } catch (error) {
    console.error("Error updating syllabus:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

syllabiRouter.delete("/deleteSyllabus/:syllabus_id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const syllabusId = req.params.syllabus_id;
  const { calendar_id, class_id, user_id } = req.body;

  try {
    await disconnectClassSyllabus(authHeader!, class_id);
    const deletedSyllabus = await deleteSyllabus(authHeader!, syllabusId);

    if (calendar_id) {
      let retrievedTokens = await getUserTokens(authHeader!, user_id);

      let provider_token = retrievedTokens[0].provider_token;
      const refresh_token = retrievedTokens[0].refresh_token;

      let deletedCalendar = await deleteCalendar(provider_token, calendar_id);

      if (deletedCalendar.status === 401 && refresh_token) {
        const refreshed = await refreshAccessToken(refresh_token);
        provider_token = refreshed.access_token;
        await updateAccessToken(authHeader!, user_id, provider_token);
        deletedCalendar = await deleteCalendar(provider_token, calendar_id);
      }
    }

    res.send(deletedSyllabus);
  } catch (error) {
    console.error("Error deleting Syllabus:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default syllabiRouter;
