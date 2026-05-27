import { useQuery } from "@tanstack/react-query";
import api from "./axiosInstance";

export interface CalendarNote {
  _id: string;
  title: string;
  body: string;
  date: string; // "YYYY-MM-DD"
  reminderAt: string | null;
  reminderInterval: string | null;
  reminderSent: boolean;
  isWholeDay?: boolean;
  createdAt: string;
}

export interface CreateCalendarNoteInput {
  title: string;
  body: string;
  date: string;
  reminderAt?: string | null;
  reminderInterval?: string | null;
  isWholeDay?: boolean;
}

export interface UpdateCalendarNoteInput {
  _id: string;
  title?: string;
  body?: string;
  date?: string;
  reminderAt?: string | null;
  reminderInterval?: string | null;
  isWholeDay?: boolean;
}

// ── API functions ─────────────────────────────────────────────────────

export async function getCalendarNotes(): Promise<CalendarNote[]> {
  const res = await api.get<CalendarNote[]>("/api/calendar-notes/");
  return res.data;
}

export async function getCalendarNotesByMonth(
  year: number,
  month: number
): Promise<CalendarNote[]> {
  const res = await api.get<CalendarNote[]>(
    `/api/calendar-notes/month/${year}/${month}`
  );
  return res.data;
}

export async function createCalendarNote(
  input: CreateCalendarNoteInput
): Promise<CalendarNote> {
  const res = await api.post<CalendarNote>("/api/calendar-notes/", input);
  return res.data;
}

export async function updateCalendarNote(
  input: UpdateCalendarNoteInput
): Promise<unknown> {
  const res = await api.patch("/api/calendar-notes/", input);
  return res.data;
}

export async function deleteCalendarNote(id: string): Promise<unknown> {
  const res = await api.delete("/api/calendar-notes/", { data: { _id: id } });
  return res.data;
}

// ── React Query hooks ─────────────────────────────────────────────────

export function useCalendarNotes() {
  return useQuery({
    queryKey: ["calendarNotes"],
    queryFn: getCalendarNotes,
    staleTime: Infinity,
    retry: 2,
    refetchOnWindowFocus: true,
    networkMode: "offlineFirst",
  });
}

export function useCalendarNotesByMonth(year: number, month: number) {
  return useQuery({
    queryKey: ["calendarNotes", year, month],
    queryFn: () => getCalendarNotesByMonth(year, month),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}
