import { supabase } from "../supabase.js";

export const saveTokens = async (
  authHeader: string,
  user_id: string,
  provider: string,
  provider_token: string,
  refresh_token: string,
  expires_at: number,
  expires_in: number
) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("user_tokens")
    .insert([
      {
        user_id,
        provider,
        provider_token,
        refresh_token,
        expires_at,
        expires_in,
      },
    ]);

  if (error) throw error;
  return data;
};

export const getUserTokens = async (authHeader: string, user_id: string) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("user_tokens")
    .select("provider_token, refresh_token")
    .eq("user_id", user_id);

  if (error) throw error;
  return data;
};

export const updateAccessToken = async (
  authHeader: string,
  user_id: string,
  access_token
) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("user_tokens")
    .update({ access_token })
    .eq("user_id", user_id);

  if (error) throw error;
  return data;
};

export const deleteTokens = async (authHeader: string, user_id: string) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("user_tokens")
    .delete()
    .eq("user_id", user_id)
    .select();

  if (error) throw error;
  return data;
};

export const createCalendar = async (provider_token: string, title: string) => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: title,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const insertCalendar = async (
  provider_token: string,
  calendarId: string
) => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList?colorRgbFormat=true",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: calendarId, // required
          selected: true, // optional → makes it visible in UI
        }),
      }
    );

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateCalendar = async (
  provider_token: string,
  calendar_id: string,
  syllabus_title: string
) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendar_id
      )}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${provider_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ summary: syllabus_title }),
      }
    );

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteCalendar = async (
  provider_token: string,
  calendar_id: string
) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendar_id
      )}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${provider_token}`,
        },
      }
    );

    if (response.status === 204) {
      return { success: true };
    }

    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: "Unknown error (no JSON returned)" };
    }

    return {
      success: false,
      status: response.status,
      error: errorData,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createCalendarEvent = async (
  provider_token: string,
  calendar_id: string,
  event: any
) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendar_id
      )}/events`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + provider_token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateCalendarEvent = async (
  provider_token: string,
  calendar_id: string,
  event_id: string,
  event: any
) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendar_id
      )}/events/${encodeURIComponent(event_id)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + provider_token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteCalendarEvent = async (
  provider_token: string,
  calendar_id: string,
  event_id: string
) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendar_id
      )}/events/${encodeURIComponent(event_id)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${provider_token}`,
        },
      }
    );

    if (response.status === 204) {
      return { success: true };
    }

    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: "Unknown error (no JSON returned)" };
    }

    return {
      success: false,
      status: response.status,
      error: errorData,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
