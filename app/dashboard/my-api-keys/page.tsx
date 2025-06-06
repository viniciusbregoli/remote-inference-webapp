"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { APIKey } from "@prisma/client";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import NewKeyDisplay from "../../../components/dashboard/NewKeyDisplay";
import CreateKeyModal from "../../../components/dashboard/CreateKeyModal";
import ConfirmationDialog from "../../../components/ui/ConfirmationDialog";
import { Key, Plus, Trash2, Power, PowerOff } from "lucide-react";
import { Tooltip } from "react-tooltip";

export default function MyApiKeysPage() {
  const { data: session } = useSession();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{ key: string; name: string } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; keyId: number | null }>({ isOpen: false, keyId: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState<number | null>(null);

  const userId = (session?.user as any)?.id;

  useEffect(() => {
    if (userId) {
      fetchApiKeys();
    }
  }, [userId]);

  const fetchApiKeys = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/apikeys/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch API keys');
      const data = await response.json();
      setApiKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async (name: string, userId: number, expires_at?: string) => {
    setError(null);
    try {
      const response = await fetch('/api/apikeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, userId, expires_at }),
      });
      if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to create key');
      }
      const newKey = await response.json();
      setNewKeyData({ key: newKey.key, name: newKey.name });
      await fetchApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsCreateModalOpen(false);
    }
  };

  const handleToggle = async (key: APIKey) => {
    try {
      const response = await fetch(`/api/apikeys/${key.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !key.is_active }),
      });
      if (!response.ok) throw new Error('Update failed');
      await fetchApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const openDeleteConfirmation = (keyId: number) => {
    setDeleteConfirmation({ isOpen: true, keyId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.keyId) return;
    try {
      await fetch(`/api/apikeys/${deleteConfirmation.keyId}`, { method: 'DELETE' });
      await fetchApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setDeleteConfirmation({ isOpen: false, keyId: null });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const maskKey = (key: string) => `••••••••••••••••••••••${key.slice(-8)}`;

  if (isLoading && apiKeys.length === 0) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-pulse flex space-x-4 w-full">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-10 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-12 bg-slate-200 rounded"></div>
              <div className="h-12 bg-slate-200 rounded"></div>
              <div className="h-12 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My API Keys</h1>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center"
        >
          <Plus size={18} className="mr-1" /> Create New Key
        </Button>
      </div>
      {error && <ErrorMessage message={error} />}
      {newKeyData && (
        <NewKeyDisplay
          apiKey={newKeyData.key}
          keyName={newKeyData.name}
          onDismiss={() => setNewKeyData(null)}
        />
      )}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center p-6 border-b border-gray-200">
          <Key className="h-5 w-5 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Your API Keys</h2>
        </div>

        {apiKeys.length === 0 && !isLoading ? (
          <div className="text-center py-12 px-6">
            <Key className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No API keys found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven&apos;t created any API keys yet. Create one to get
              started.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center mx-auto"
              >
                <Plus size={18} className="mr-1" /> Create New Key
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Key
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Expires
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        className={`${
                          !key.is_active
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                      >
                        {key.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {maskKey(key.key)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          key.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {key.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(key.expires_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(key.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center min-w-[80px]">
                        <button
                          onClick={() => handleToggle(key)}
                          disabled={isToggling === key.id}
                          className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          data-tooltip-id={`tooltip-toggle-${key.id}`}
                          data-tooltip-content={
                            key.is_active ? "Deactivate Key" : "Activate Key"
                          }
                        >
                          {isToggling === key.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                          ) : key.is_active ? (
                            <PowerOff size={16} className="text-amber-600" />
                          ) : (
                            <Power size={16} className="text-green-600" />
                          )}
                        </button>
                        <Tooltip id={`tooltip-toggle-${key.id}`} place="top" />

                        <button
                          onClick={() => openDeleteConfirmation(key.id)}
                          disabled={isToggling === key.id}
                          className="w-8 h-8 ml-1 flex items-center justify-center rounded text-red-500 hover:text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          data-tooltip-id={`tooltip-delete-${key.id}`}
                          data-tooltip-content="Delete Key"
                        >
                          <Trash2 size={16} />
                        </button>
                        <Tooltip id={`tooltip-delete-${key.id}`} place="top" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <CreateKeyModal
        isOpen={isCreateModalOpen}
        isLoading={isCreating}
        isAdmin={false}
        defaultUserId={userId}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateKey}
      />
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        title="Delete API Key"
        message="Are you sure you want to delete this API key? This action cannot be undone and any applications using this key will no longer be able to access the API."
        confirmText="Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmation({ isOpen: false, keyId: null })}
      />
    </div>
  );
}
