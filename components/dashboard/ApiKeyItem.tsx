import { useState } from "react";
import { ApiKey } from "../../types";
import { ClipboardCopy, Check, User } from "lucide-react";

interface ApiKeyItemProps {
  apiKey: ApiKey;
  onToggleActivation: (key: ApiKey) => void;
  onDelete: (keyId: number) => void;
  showFullKey?: boolean;
}

export default function ApiKeyItem({
  apiKey,
  onToggleActivation,
  onDelete,
  showFullKey = false,
}: ApiKeyItemProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Format date to be more readable
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Show only last 8 characters of the API key for security
  const maskedKey = showFullKey
    ? apiKey.key
    : `••••••••••••••••••••••${apiKey.key.slice(-8)}`;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900">{apiKey.name}</h3>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            apiKey.is_active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {apiKey.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Add user information display */}
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <User className="h-4 w-4 mr-1" />
        <span>User: {apiKey.user_username || `ID: ${apiKey.user_id}`}</span>
      </div>

      <div className="flex items-center mb-3 bg-gray-50 p-2 rounded border border-gray-200">
        <code className="flex-1 font-mono text-sm overflow-x-auto whitespace-nowrap">
          {maskedKey}
        </code>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="text-gray-500">Created:</span>{" "}
          <span className="text-gray-700">{formatDate(apiKey.created_at)}</span>
        </div>
        <div>
          <span className="text-gray-500">Expires:</span>{" "}
          <span className="text-gray-700">{formatDate(apiKey.expires_at)}</span>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onToggleActivation(apiKey)}
          className={`px-3 py-1 rounded text-sm font-medium ${
            apiKey.is_active
              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          {apiKey.is_active ? "Deactivate" : "Activate"}
        </button>
        <button
          onClick={() => onDelete(apiKey.id)}
          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
