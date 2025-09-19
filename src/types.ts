export interface ExtractedAssignmentType {
  id: number;
  syllabus_id: number;
  user_id: string;
  title: string;
  subtitle: string;
  deadline: Date;
  start: string;
  end: string;
  created_at: Date;
  event_id: string;
}

export interface FormattedAssignmentType {
  syllabus_id: number;
  title: string;
  subtitle: string;
  start: string;
  end: string;
}

export interface SyllabusType {
  title: string;
  assignments: ExtractedAssignmentType[];
}
