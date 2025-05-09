"use server";
import { api } from "@/lib/utils";

export async function getTwitterNews() {
  const response = await api.get("/news/twitter");
  return response.data?.[0] || [];
} 