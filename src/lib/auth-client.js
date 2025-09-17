import { createAuthClient } from "better-auth/react";

// Create the auth client once with proper configuration
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
