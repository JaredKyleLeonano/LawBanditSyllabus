import { supabase } from "../supabase.js";

export const getSyllabi = async (authHeader: string) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("syllabi")
    .select("id, title, color, calendar_id, class_id")
    .order("id", { ascending: true });

  if (error) throw error;
  return data;
};

export const uploadSyllabus = async (
  authHeader: string,
  class_id: string,
  title: string,
  color: string,
  calendar_id: string = null
) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("syllabi")
    .insert([
      {
        title,
        class_id,
        color,
        calendar_id,
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

export const updateSyllabus = async (
  authHeader: string,
  id: string,
  title: string
) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("syllabi")
    .update({
      title,
    })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

export const deleteSyllabus = async (authHeader: string, id: string) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("syllabi")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};
