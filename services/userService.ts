import { getSession } from "next-auth/react";

export async function getCurrentUser() {
  const session = await getSession();

  if (!session || !session.user) {
    return null;
  }

  // The user object from the session should contain what we need.
  // This function can be expanded if we need to fetch more data from our API.
  return session.user;
}