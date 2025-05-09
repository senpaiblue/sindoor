import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const api = axios.create({
  baseURL: "https://017b-2405-201-a40c-488f-c5d4-470-ae7d-43c.ngrok-free.app",
  headers: {
    "Content-Type": "application/json",
  },
});