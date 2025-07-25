import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
  // Backend URL
  baseURL: "http://localhost:8000"
})