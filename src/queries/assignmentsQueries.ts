import { supabase } from "../supabase.js";
import { FormattedAssignmentType } from "../types.js";

export const uploadAssignments = async (
  authHeader: string,
  assignments: FormattedAssignmentType[]
) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("assignments")
    .insert(assignments);

  if (error) throw error;
  return data;
};

export const getAssignments = async (authHeader: string) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("assignments")
    .select(`*`);

  if (error) throw error;
  return data;
};

export const createAssignment = async (
  authHeader: string,
  syllabus_id: string,
  title: string,
  subtitle: string,
  start: string,
  end: string,
  event_id: string | null = null
) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("assignments")
    .insert([{ syllabus_id, title, subtitle, start, end, event_id }])
    .select();

  if (error) throw error;
  return data;
};

export const updateAssignment = async (
  authHeader: string,
  id: string,
  title: string,
  subtitle: string,
  start: string,
  end: string
) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("assignments")
    .update({
      title,
      subtitle,
      start,
      end,
    })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

export const deleteAssignment = async (authHeader: string, id: string) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("assignments")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};
