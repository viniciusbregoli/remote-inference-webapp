import { getAuthHeader } from "./auth";
import { User } from "../types";

const API_URL = "http://localhost:5000";

/**
 * Get all users (admin only)
 * @returns List of users
 */
export async function getAllUsers() {
  const headers = {
    ...getAuthHeader(),
  };

  const response = await fetch(`${API_URL}/users/`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

/**
 * Create a new user (admin only)
 * @param username Username
 * @param email Email address
 * @param password Password
 * @param isAdmin Whether the user is an admin
 * @returns The created user
 */
export async function createUser(
  username: string,
  email: string,
  password: string,
  isAdmin: boolean = false
) {
  const headers = {
    ...getAuthHeader(),
    "Content-Type": "application/json",
  };

  const body = {
    username,
    email,
    password,
    is_admin: isAdmin,
  };

  const response = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create user");
  }

  return response.json();
}

/**
 * Update a user
 * @param userId User ID
 * @param data Update data
 * @returns The updated user
 */
export async function updateUser(userId: number, data: Partial<User>) {
  const headers = {
    ...getAuthHeader(),
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
}

/**
 * Delete a user
 * @param userId User ID
 */
export async function deleteUser(userId: number) {
  const headers = {
    ...getAuthHeader(),
  };

  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
}

/**
 * Toggle user active status
 * @param userId User ID
 * @param isActive Whether the user should be active
 * @returns The updated user
 */
export async function toggleUserActive(userId: number, isActive: boolean) {
  return updateUser(userId, { is_active: isActive });
}

/**
 * Toggle admin status
 * @param userId User ID
 * @param isAdmin Whether the user should be an admin
 * @returns The updated user
 */
export async function toggleUserAdmin(userId: number, isAdmin: boolean) {
  return updateUser(userId, { is_admin: isAdmin });
}