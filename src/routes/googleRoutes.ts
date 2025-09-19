import express from "express";
import {
  createCalendar,
  deleteTokens,
  getUserTokens,
  insertCalendar,
  updateAccessToken,
} from "../queries/googleQueries.js";
import { saveTokens } from "../queries/googleQueries.js";
import { refreshAccessToken } from "../helpers/googleTokens.js";

const googleRouter = express.Router();

googleRouter.post("/saveTokens", async (req, res) => {
  const authHeader = req.headers.authorization;

  try {
    const {
      user_id,
      provider,
      provider_token,
      refresh_token,
      expires_at,
      expires_in,
    } = req.body;
    const savedTokens = await saveTokens(
      authHeader,
      user_id,
      provider,
      provider_token,
      refresh_token,
      expires_at,
      expires_in
    );
    res.send(savedTokens);
  } catch (err) {
    console.error("Error saving tokens:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

googleRouter.delete("/deleteTokens/:user_id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const user_id = req.params.user_id;

  try {
    const deletedTokens = await deleteTokens(authHeader, user_id);

    res.send(deletedTokens);
  } catch (error) {
    console.error("Error deleting tokens:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

googleRouter.post("/createCalendar", async (req, res) => {
  const authHeader = req.headers.authorization;
  const { user_id, title } = req.body;
  try {
    let retrievedTokens = await getUserTokens(authHeader, user_id);

    let access_token = retrievedTokens[0].provider_token;
    const refresh_token = retrievedTokens[0].refresh_token;

    let createdCalendar = await createCalendar(access_token!, title);

    if (createdCalendar.status === 401 && refresh_token) {
      const refreshed = await refreshAccessToken(refresh_token);
      access_token = refreshed.access_token;
      await updateAccessToken(authHeader, user_id, access_token);
      createdCalendar = await createCalendar(access_token!, title);
    }

    await insertCalendar(access_token, createdCalendar.id);

    return res.json({ calendarId: createdCalendar.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

export default googleRouter;
