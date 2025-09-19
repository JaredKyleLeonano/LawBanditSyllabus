import { supabase } from "../supabase.js";

export const createClass = async (authHeader: string, title: string) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader).from("classes").insert([
    {
      title,
    },
  ]);

  if (error) throw error;
  return data;
};

export const getClasses = async (authHeader: string) => {
  if (!authHeader) throw new Error("Missing authorization header");
  const { data, error } = await supabase(authHeader)
    .from("classes")
    .select("id, syllabus_id, title, created_at")
    .order("id", { ascending: true });

  if (error) throw error;
  return data;
};

export const updateClass = async (
  authHeader: string,
  classId: string,
  title: string
) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("classes")
    .update({
      title,
    })
    .eq("id", classId)
    .select();

  if (error) throw error;
  return data;
};

export const connectClassSyllabus = async (
  authHeader: string,
  classId: string,
  syllabus_id: string
) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("classes")
    .update({
      syllabus_id,
    })
    .eq("id", classId)
    .select();

  if (error) throw error;
  return data;
};

export const disconnectClassSyllabus = async (
  authHeader: string,
  classId: string
) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("classes")
    .update({
      syllabus_id: null,
    })
    .eq("id", classId)
    .select();

  if (error) throw error;
  return data;
};

export const deleteClass = async (authHeader: string, id: string) => {
  if (!authHeader) throw new Error("Missing authorization header");

  const { data, error } = await supabase(authHeader)
    .from("classes")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};
