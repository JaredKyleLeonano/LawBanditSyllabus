import express from "express";
import {
  createAssignment,
  deleteAssignment,
  getAssignments,
  updateAssignment,
} from "../queries/assignmentsQueries.js";
import {
  deleteCalendarEvent,
  updateCalendarEvent,
  createCalendarEvent,
} from "../queries/googleQueries.js";
import { getUserTokens } from "../queries/googleQueries.js";
import normalizeDate from "../helpers/normalizeDate.js";
import { refreshAccessToken } from "../helpers/googleTokens.js";
import { updateAccessToken } from "../queries/googleQueries.js";

const assignmentsRouter = express.Router();

assignmentsRouter.get("/getAssignments", async (req, res) => {
  const authHeader = req.headers.authorization;
  try {
    const assignments = await getAssignments(authHeader!);

    res.send(assignments);
  } catch (error) {
    console.error("Error retrieving assignments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

assignmentsRouter.post("/createAssignment", async (req, res) => {
  const authHeader = req.headers.authorization;
  const { calendar_id, user_id, syllabus_id, title, subtitle, start, end } =
    req.body;
  try {
    let event_id = null;
    if (calendar_id) {
      const event = {
        summary: title,
        description: subtitle,
        start: {
          dateTime: normalizeDate(start),
        },
        end: {
          dateTime: normalizeDate(end),
        },
      };
      let retrievedTokens = await getUserTokens(authHeader!, user_id);

      let provider_token = retrievedTokens[0].provider_token;
      const refresh_token = retrievedTokens[0].refresh_token;

      let createdEvent = await createCalendarEvent(
        provider_token!,
        calendar_id,
        event
      );

      if (createdEvent.error?.code === 401 && refresh_token) {
        const refreshed = await refreshAccessToken(refresh_token);
        provider_token = refreshed.access_token;
        await updateAccessToken(authHeader!, user_id, provider_token);
        createdEvent = await createCalendarEvent(
          provider_token!,
          calendar_id,
          event
        );
      }
      event_id = createdEvent.id;
    }

    const createdAssignment = await createAssignment(
      authHeader!,
      syllabus_id,
      title,
      subtitle,
      start,
      end,
      event_id
    );

    res.send(createdAssignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

assignmentsRouter.put("/updateAssignment/:assignment_id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const assignmentId = req.params.assignment_id;
  const { event_id, calendar_id, user_id, title, subtitle, start, end } =
    req.body;

  try {
    const updatedAssignment = await updateAssignment(
      authHeader!,
      assignmentId,
      title,
      subtitle,
      start,
      end
    );

    if (event_id) {
      const event = {
        summary: title,
        description: subtitle,
        start: {
          dateTime: normalizeDate(start),
        },
        end: {
          dateTime: normalizeDate(end),
        },
      };

      let retrievedTokens = await getUserTokens(authHeader!, user_id);

      let provider_token = retrievedTokens[0].provider_token;
      const refresh_token = retrievedTokens[0].refresh_token;

      let updatedEvent = await updateCalendarEvent(
        provider_token!,
        calendar_id,
        event_id,
        event
      );

      if (updatedEvent.error?.code === 401 && refresh_token) {
        const refreshed = await refreshAccessToken(refresh_token);
        provider_token = refreshed.access_token;
        await updateAccessToken(authHeader!, user_id, provider_token);
        updatedEvent = await updateCalendarEvent(
          provider_token!,
          calendar_id,
          event_id,
          event
        );
      }
    }

    res.send(updatedAssignment);
  } catch (error) {
    console.error("Error updating assignment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

assignmentsRouter.delete(
  "/deleteAssignment/:assignment_id",
  async (req, res) => {
    const authHeader = req.headers.authorization;
    const assignmentId = req.params.assignment_id;
    const { event_id, calendar_id, user_id } = req.body;

    try {
      const deletedAssignment = await deleteAssignment(
        authHeader!,
        assignmentId
      );

      if (event_id) {
        let retrievedTokens = await getUserTokens(authHeader!, user_id);

        let provider_token = retrievedTokens[0].provider_token;
        const refresh_token = retrievedTokens[0].refresh_token;

        let deletedEvent = await deleteCalendarEvent(
          provider_token!,
          calendar_id,
          event_id
        );

        if (deletedEvent.status === 401 && refresh_token) {
          const refreshed = await refreshAccessToken(refresh_token);
          provider_token = refreshed.access_token;
          await updateAccessToken(authHeader!, user_id, provider_token);
          deletedEvent = await deleteCalendarEvent(
            provider_token!,
            calendar_id,
            event_id
          );
        }
      }
      res.send(deletedAssignment);
    } catch (error) {
      console.error("Error deleting assignment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default assignmentsRouter;
