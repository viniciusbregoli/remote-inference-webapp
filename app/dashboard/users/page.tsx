"use client";

import { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  toggleUserActive,
  toggleUserAdmin,
  deleteUser,
} from "../../../services/userService";
import { getCurrentUser } from "../../../services/api";
import { User } from "../../../types";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import UserItem from "../../../components/dashboard/UserItem";
import CreateUserModal from "../../../components/dashboard/CreateUserModal";
import ConfirmationDialog from "../../../components/ui/ConfirmationDialog";
import { UserPlus, Users } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    userId: number | null;
  }>({
    isOpen: false,
    userId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUserId(user.id);
      setIsAdmin(user.is_admin);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch current user information"
      );
    }
  };

  const handleCreateUser = async (
    username: string,
    email: string,
    password: string,
    isAdmin: boolean
  ) => {
    setIsCreating(true);
    setError(null);

    try {
      await createUser(username, email, password, isAdmin);

      // Close modal
      setIsCreateModalOpen(false);

      // Refresh the list
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await toggleUserActive(user.id, !user.is_active);
      // Refresh the list after toggling
      fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${user.is_active ? "deactivate" : "activate"} user`
      );
    }
  };

  const handleToggleAdmin = async (user: User) => {
    try {
      await toggleUserAdmin(user.id, !user.is_admin);
      // Refresh the list after toggling
      fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${
              user.is_admin ? "remove admin privileges from" : "make admin"
            } user`
      );
    }
  };

  const openDeleteConfirmation = (userId: number) => {
    setDeleteConfirmation({
      isOpen: true,
      userId,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.userId) return;

    setIsDeleting(true);
    try {
      await deleteUser(deleteConfirmation.userId);
      // Refresh the list after deleting
      fetchUsers();
      // Close the confirmation dialog
      setDeleteConfirmation({ isOpen: false, userId: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't show the page if the current user is not an admin
  if (!isAdmin && !isLoading) {
    return (
      <div className="p-8">
        <ErrorMessage
          title="Access Denied"
          message="You need administrator privileges to access this page."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center"
        >
          <UserPlus size={18} className="mr-1" /> Create New User
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* List existing users */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Users className="h-5 w-5 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">System Users</h2>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new user.
            </p>

            <div className="mt-6">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center mx-auto"
              >
                <UserPlus size={18} className="mr-1" /> Create New User
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {users.map((user) => (
              <UserItem
                key={user.id}
                user={user}
                onToggleActive={handleToggleActive}
                onToggleAdmin={handleToggleAdmin}
                onDelete={openDeleteConfirmation}
                currentUserId={currentUserId || 0}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        isLoading={isCreating}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone and all API keys associated with this user will be deleted as well."
        confirmText="Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmation({ isOpen: false, userId: null })}
      />
    </div>
  );
}
