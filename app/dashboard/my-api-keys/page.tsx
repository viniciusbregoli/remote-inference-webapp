"use client";

import { useEffect, useState } from "react";
import {
  getUserApiKeys,
  createApiKey,
  deactivateApiKey,
  activateApiKey,
  deleteApiKey,
} from "../../../services/apiKeyService";
import { getCurrentUser } from "../../../services/api";
import { ApiKey } from "../../../types";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import ApiKeyItem from "../../../components/dashboard/ApiKeyItem";
import NewKeyDisplay from "../../../components/dashboard/NewKeyDisplay";
import CreateKeyModal from "../../../components/dashboard/CreateKeyModal";
import ConfirmationDialog from "../../../components/ui/ConfirmationDialog";
import { Key, Plus, AlertCircle } from "lucide-react";

export default function MyApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{
    key: string;
    name: string;
  } | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    keyId: number | null;
  }>({
    isOpen: false,
    keyId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCurrentUser().then(() => {
      fetchApiKeys();
    });
  }, []);

  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      // Fetch only the current user's API keys
      const keys = await getUserApiKeys();
      setApiKeys(keys);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch API keys");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setUserId(user.id);
      return user;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user information"
      );
      return null;
    }
  };

  const handleCreateKey = async (
    name: string,
    userId: number,
    expirationDate?: string
  ) => {
    setIsCreating(true);
    setError(null);

    try {
      const newKey = await createApiKey(
        userId,
        name,
        expirationDate ? new Date(expirationDate).toISOString() : undefined
      );

      setNewKeyData({
        key: newKey.key,
        name: newKey.name,
      });

      // Close modal
      setIsCreateModalOpen(false);

      // Refresh the list
      fetchApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create API key");
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleActivation = async (key: ApiKey) => {
    try {
      if (key.is_active) {
        await deactivateApiKey(key.id);
      } else {
        await activateApiKey(key.id);
      }
      // Refresh the list after toggling
      fetchApiKeys();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${key.is_active ? "deactivate" : "activate"} API key`
      );
    }
  };

  const openDeleteConfirmation = (keyId: number) => {
    setDeleteConfirmation({
      isOpen: true,
      keyId,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.keyId) return;

    setIsDeleting(true);
    try {
      await deleteApiKey(deleteConfirmation.keyId);
      // Refresh the list after deleting
      fetchApiKeys();
      // Close the confirmation dialog
      setDeleteConfirmation({ isOpen: false, keyId: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete API key");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && apiKeys.length === 0) {
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

      {/* Display new API key after creation */}
      {newKeyData && (
        <NewKeyDisplay
          apiKey={newKeyData.key}
          keyName={newKeyData.name}
          onDismiss={() => setNewKeyData(null)}
        />
      )}

      {/* List existing API keys */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Key className="h-5 w-5 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Your API Keys</h2>
        </div>

        {apiKeys.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <Key className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No API keys
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
          <div className="grid gap-6 md:grid-cols-2">
            {apiKeys.map((key) => (
              <ApiKeyItem
                key={key.id}
                apiKey={key}
                onToggleActivation={handleToggleActivation}
                onDelete={openDeleteConfirmation}
              />
            ))}
          </div>
        )}
      </div>

      {/* How to use section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">
            How to Use Your API Key
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            To use the YOLO Object Detection API, include your API key in the
            request header:
          </p>

          <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
            <pre className="text-sm">
              <code>
                {`# Example cURL request
curl -X POST http://localhost:5000/detect \\
  -H "X-API-Key: your_api_key_here" \\
  -F "image=@path/to/your/image.jpg"`}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      <CreateKeyModal
        isOpen={isCreateModalOpen}
        isLoading={isCreating}
        isAdmin={false}
        defaultUserId={userId}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateKey}
      />

      {/* Delete Confirmation Dialog */}
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
