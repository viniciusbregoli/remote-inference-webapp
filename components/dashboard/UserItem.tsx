import { User } from "../../types";
import { UserCircle, Shield, ShieldCheck } from "lucide-react";

interface UserItemProps {
  user: User;
  onToggleActive: (user: User) => void;
  onToggleAdmin: (user: User) => void;
  onDelete: (userId: number) => void;
  currentUserId: number; // To prevent self-deletion or deactivation
}

export default function UserItem({
  user,
  onToggleActive,
  onToggleAdmin,
  onDelete,
  currentUserId,
}: UserItemProps) {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if this user is the current logged-in user
  const isSelf = user.id === currentUserId;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <UserCircle className="h-6 w-6 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">{user.username}</h3>
        </div>
        <div className="flex space-x-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              user.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.is_active ? "Active" : "Inactive"}
          </span>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              user.is_admin
                ? "bg-purple-100 text-purple-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {user.is_admin ? "Admin" : "User"}
          </span>
        </div>
      </div>

      <div className="text-gray-500 text-sm mb-3">{user.email}</div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="text-gray-500">Created:</span>{" "}
          <span className="text-gray-700">{formatDate(user.created_at)}</span>
        </div>
        <div>
          <span className="text-gray-500">Updated:</span>{" "}
          <span className="text-gray-700">{formatDate(user.updated_at)}</span>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onToggleActive(user)}
          disabled={isSelf}
          className={`px-3 py-1 rounded text-sm font-medium ${
            isSelf
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : user.is_active
              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
          title={isSelf ? "Cannot deactivate yourself" : ""}
        >
          {user.is_active ? "Deactivate" : "Activate"}
        </button>
        <button
          onClick={() => onToggleAdmin(user)}
          disabled={isSelf}
          className={`px-3 py-1 rounded text-sm font-medium flex items-center ${
            isSelf
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : user.is_admin
              ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          }`}
          title={isSelf ? "Cannot change your own admin status" : ""}
        >
          {user.is_admin ? (
            <>
              <ShieldCheck className="h-3 w-3 mr-1" /> Remove Admin
            </>
          ) : (
            <>
              <Shield className="h-3 w-3 mr-1" /> Make Admin
            </>
          )}
        </button>
        <button
          onClick={() => onDelete(user.id)}
          disabled={isSelf}
          className={`px-3 py-1 rounded text-sm font-medium ${
            isSelf
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
          title={isSelf ? "Cannot delete yourself" : ""}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
