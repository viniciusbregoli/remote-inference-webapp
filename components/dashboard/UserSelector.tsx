import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { ChevronDown, ChevronUp, Search, Loader } from "lucide-react";

interface UserSelectorProps {
  selectedUserId: number | null;
  onSelectUser: (userId: number) => void;
  disabled?: boolean;
}

export default function UserSelector({
  selectedUserId,
  onSelectUser,
  disabled = false,
}: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Server error');
      const fetchedUsers = await response.json();
      const activeUsers = fetchedUsers.filter((user: User) => user.is_active);
      setUsers(activeUsers);

      if (!selectedUserId && activeUsers.length > 0) {
        onSelectUser(activeUsers[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelectUser = (userId: number) => {
    onSelectUser(userId);
    setIsOpen(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the selected user's name
  const selectedUser = users.find((user) => user.id === selectedUserId);

  return (
    <div className="relative">
      <label
        htmlFor="user-selector"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        User*
      </label>
      <div
        className={`relative border ${
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "cursor-pointer hover:border-indigo-500"
        } ${
          isOpen ? "border-indigo-500" : "border-gray-300"
        } rounded-md shadow-sm transition-colors`}
      >
        <div
          id="user-selector"
          onClick={toggleDropdown}
          className={`w-full px-3 py-2 flex justify-between items-center ${
            disabled ? "text-gray-500" : "text-gray-800"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader className="h-4 w-4 animate-spin text-indigo-500" />
              <span className="text-gray-500">Loading users...</span>
            </div>
          ) : selectedUser ? (
            <div className="flex flex-col">
              <span className="font-semibold">{selectedUser.username}</span>
              <span className="text-xs text-gray-500">
                {selectedUser.email}
              </span>
            </div>
          ) : (
            <span className="text-gray-500">Select a user</span>
          )}
          {!disabled && (
            <div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          )}
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <ul className="max-h-60 overflow-y-auto py-1">
              {filteredUsers.length === 0 ? (
                <li className="px-4 py-2 text-sm text-gray-500">
                  No users found
                </li>
              ) : (
                filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleSelectUser(user.id)}
                    className={`px-4 py-2 text-sm hover:bg-indigo-50 cursor-pointer ${
                      selectedUserId === user.id
                        ? "bg-indigo-100 text-indigo-800"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{user.username}</span>
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
