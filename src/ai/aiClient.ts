import * as GroqModule from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const GroqCtor = (GroqModule as any).default ?? (GroqModule as any);
const client = new GroqCtor({ apiKey: process.env.GROQ_API_KEY });

export async function extractAssignments(pdf: string) {
  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-120b", // Free model
    messages: [
      {
        role: "system",
        content:
          "You are an assistant that extracts all tasks from a law school syllabus into strict JSON format. Only output valid JSON. The JSON must contain two top-level keys: {title: string, assignments: [{title: string, subtitle: string, deadline: string, start: string, end: string}]}. The subtitle is a short description of the task. Deadlines must be in YYYY-MM-DD. Start and end times must be in 24-hour (military) format. Do not include explanations, text, or markdown. Always infer dates, times, and subtitles from the syllabus or class schedule when not explicitly specified.",
      },
      {
        role: "user",
        content: `Task: From the syllabus below, search for the tasks(readings, submissions, optional tasks, seminars, conferences, etc.) and the date that they are given and/or expected to be accomplished. 
            These are the rules and reminders that you must follow:
            - Output only as JSON with the structure: {title: "syllabus title", assignments: [{title: string, subtitle: string, deadline: string, start: string, end: string}]}.
            - All deadlines must use YYYY-MM-DD.
            - Extract only tasks with specific dates (readings, submissions, optional tasks, seminars, conferences, etc). Ignore ongoing/throughout-the-semester tasks.
            - Always include tasks that appear under canceled class days or “NO CLASS” labels. Even if no formal class is scheduled, any assignments, readings, or conferences listed for that day must be included and assigned a proper date.
            - Determine class meeting days from the syllabus (e.g., MWF).
            - If a task lists week/day without a date, infer the exact date using:
                1. Class schedule,
                2. Semester start date,
                3. Nearby explicit dates (deadlines, holidays) to align the calendar.
            - If no date is given, assign it to the first scheduled class day of that week.
            - Each task must include start and end times. These should come from the class schedule in the syllabus. If the schedule specifies a different time (e.g., a lunch meeting), use the specified times for that date.
            - stat and end should use military time.
            - Cross-check all inferred dates with other deadlines in the syllabus to ensure chronological consistency.
            - Never output “unspecified”; always infer a valid date.
            - If multiple items are listed (cases, chapters, readings, etc.), create a separate JSON object for each, even if they share the same date.
            - Output **only** valid JSON and nothing else — no explanations, text, markdown fences, or commentary.
            The syllabus is as follows:
            \n\n${pdf}
            `,
      },
    ],
  });
  console.log(response.choices[0].message.content);
  const scheduleCleaned = response.choices[0].message
    .content!.replace(/```json|```/g, "")
    .trim();
  const schedule = JSON.parse(scheduleCleaned);
  return schedule;
}

export default { extractAssignments };
