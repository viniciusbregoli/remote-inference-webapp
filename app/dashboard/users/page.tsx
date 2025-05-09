"use client";

import { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  toggleUserActive,
  toggleUserAdmin,
  deleteUser,
} from "../../../services/userService";
import { getCurrentUser } from "../../../services/userService";
import { User } from "../../../types";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import CreateUserModal from "../../../components/dashboard/CreateUserModal";
import ConfirmationDialog from "../../../components/ui/ConfirmationDialog";
import {
  UserPlus,
  Users,
  Trash2,
  Power,
  PowerOff,
  Shield,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { Tooltip } from "react-tooltip";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    userId: number | null;
  }>({
    isOpen: false,
    userId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingActive, setIsTogglingActive] = useState<number | null>(null);
  const [isTogglingAdmin, setIsTogglingAdmin] = useState<number | null>(null);

  useEffect(() => {
    fetchCurrentUser().then((user) => {
      if (user?.is_admin) {
        fetchUsers();
      } else {
        setIsLoading(false);
      }
    });
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
      setIsAdminUser(user.is_admin);
      return user;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch current user information"
      );
      setIsAdminUser(false);
      setIsLoading(false);
      return null;
    }
  };

  const handleCreateUser = async (
    username: string,
    email: string,
    password: string,
    isAdminRole: boolean
  ) => {
    setIsCreating(true);
    setError(null);

    try {
      await createUser(username, email, password, isAdminRole);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      // Always close modal and stop loading state
      setIsCreating(false);
      setIsCreateModalOpen(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    if (user.id === currentUserId) return;
    setIsTogglingActive(user.id);
    try {
      await toggleUserActive(user.id, !user.is_active);
      fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${user.is_active ? "deactivate" : "activate"} user`
      );
    } finally {
      setIsTogglingActive(null);
    }
  };

  const handleToggleAdmin = async (user: User) => {
    if (user.id === currentUserId) return;
    setIsTogglingAdmin(user.id);
    try {
      await toggleUserAdmin(user.id, !user.is_admin);
      fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${
              user.is_admin ? "remove admin privileges from" : "make admin"
            } user`
      );
    } finally {
      setIsTogglingAdmin(null);
    }
  };

  const openDeleteConfirmation = (userId: number) => {
    if (userId === currentUserId) return;
    setDeleteConfirmation({
      isOpen: true,
      userId,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.userId) return;
    if (deleteConfirmation.userId === currentUserId) {
      setError("You cannot delete your own account.");
      setDeleteConfirmation({ isOpen: false, userId: null });
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUser(deleteConfirmation.userId);
      fetchUsers();
      setDeleteConfirmation({ isOpen: false, userId: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAdminUser && !isLoading) {
    return (
      <div className="p-8">
        <ErrorMessage
          title="Access Denied"
          message="You need administrator privileges to access this page."
        />
      </div>
    );
  }

  if (isLoading && users.length === 0) {
    return (
      <div className="p-8">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-10 bg-slate-200 rounded w-32"></div>
          </div>
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-12 bg-slate-200 rounded"></div>
            <div className="h-12 bg-slate-200 rounded"></div>
            <div className="h-12 bg-slate-200 rounded"></div>
          </div>
        </div>
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

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center p-6 border-b border-gray-200">
          <Users className="h-5 w-5 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">System Users</h2>
        </div>

        {users.length === 0 && !isLoading ? (
          <div className="text-center py-12 px-6">
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
                <UserPlus size={18} className="mr-1" /> Create First User
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[70vh]">
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]"
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]"
                  >
                    Updated
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  const isSelf = user.id === currentUserId;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                        <div className="flex items-center">
                          <UserCircle className="h-5 w-5 text-gray-400 mr-2" />
                          <div
                            className={`text-sm font-medium ${
                              !user.is_active
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {user.username}
                            {isSelf && (
                              <span className="ml-2 text-xs text-blue-600 font-normal no-underline">
                                (You)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis text-sm">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            user.is_admin
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.is_admin ? (
                            <ShieldCheck className="h-3 w-3 mr-1" />
                          ) : (
                            <Shield className="h-3 w-3 mr-1" />
                          )}
                          {user.is_admin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis text-sm text-gray-500">
                        {formatDate(user.updated_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis text-sm font-medium">
                        <div className="flex items-center min-w-[120px]">
                          <button
                            onClick={() => handleToggleActive(user)}
                            disabled={
                              isSelf ||
                              isTogglingActive === user.id ||
                              isTogglingAdmin === user.id
                            }
                            className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-tooltip-id={`tooltip-active-${user.id}`}
                            data-tooltip-content={
                              user.is_active
                                ? "Deactivate User"
                                : "Activate User"
                            }
                            data-tooltip-place="top"
                          >
                            {isTogglingActive === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                            ) : user.is_active ? (
                              <PowerOff size={16} className="text-amber-600" />
                            ) : (
                              <Power size={16} className="text-green-600" />
                            )}
                          </button>
                          <Tooltip id={`tooltip-active-${user.id}`} />

                          <button
                            onClick={() => handleToggleAdmin(user)}
                            disabled={
                              isSelf ||
                              isTogglingAdmin === user.id ||
                              isTogglingActive === user.id
                            }
                            className="w-8 h-8 ml-1 flex items-center justify-center rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-tooltip-id={`tooltip-admin-${user.id}`}
                            data-tooltip-content={
                              user.is_admin
                                ? "Remove Admin Privileges"
                                : "Make Admin"
                            }
                            data-tooltip-place="top"
                          >
                            {isTogglingAdmin === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                            ) : user.is_admin ? (
                              <ShieldCheck
                                size={16}
                                className="text-purple-600"
                              />
                            ) : (
                              <Shield size={16} className="text-indigo-600" />
                            )}
                          </button>
                          <Tooltip id={`tooltip-admin-${user.id}`} />

                          <button
                            onClick={() => openDeleteConfirmation(user.id)}
                            disabled={
                              isSelf ||
                              isDeleting ||
                              isTogglingActive === user.id ||
                              isTogglingAdmin === user.id
                            }
                            className="w-8 h-8 ml-1 flex items-center justify-center rounded text-red-500 hover:text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-tooltip-id={`tooltip-delete-${user.id}`}
                            data-tooltip-content="Delete User"
                            data-tooltip-place="top"
                          >
                            <Trash2 size={16} />
                          </button>
                          <Tooltip id={`tooltip-delete-${user.id}`} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        isLoading={isCreating}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />

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
