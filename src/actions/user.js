"use server";
import { auth } from "@/lib/auth"; // path to your Better Auth server
import { headers } from "next/headers";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  return session;
}
