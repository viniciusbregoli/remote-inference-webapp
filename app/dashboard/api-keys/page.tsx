"use client";

import { useState, useEffect, FormEvent } from "react";
import { CheckCircle, Copy, Plus } from "lucide-react";
import Button from "../../../components/ui/Button";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { getAuthHeader } from "../../../services/auth";

interface APIKey {
  id: number;
  key: string;
  name: string;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

export default function APIKeysPage() {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [creatingKey, setCreatingKey] = useState(false);
  const [newKeyData, setNewKeyData] = useState<APIKey | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  async function fetchApiKeys() {
    try {
      setIsLoading(true);
      const headers = {
        ...getAuthHeader(),
      };

      const response = await fetch("http://localhost:5000/api-keys/me", {
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch API keys");
      }

      const data = await response.json();
      setKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch API keys");
      console.error("Error fetching API keys:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateKey = async (e: FormEvent) => {
    e.preventDefault();

    if (!newKeyName.trim()) {
      setError("Key name is required");
      return;
    }

    try {
      setCreatingKey(true);
      setError(null);

      const headers = {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      };

      const response = await fetch("http://localhost:5000/api-keys", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: newKeyName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create API key");
      }

      const data = await response.json();
      setNewKeyData(data);
      setKeys([...keys, data]);
      setNewKeyName("");
      setShowNewKeyForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create API key");
    } finally {
      setCreatingKey(false);
    }
  };

  const handleToggleActivation = async (keyId: number, activate: boolean) => {
    try {
      const endpoint = activate ? "activate" : "deactivate";
      const headers = {
        ...getAuthHeader(),
      };

      const response = await fetch(
        `http://localhost:5000/api-keys/${keyId}/${endpoint}`,
        {
          method: "PUT",
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to ${endpoint} API key`);
      }

      await fetchApiKeys();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update API key status"
      );
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 3000);
  };

  if (isLoading && keys.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500">Loading API keys...</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          API Keys
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          Manage your API keys for accessing the YOLO Detection API.
        </p>
      </div>

      <div className="mb-6 flex justify-end">
        <Button
          onClick={() => setShowNewKeyForm(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New API Key
        </Button>
      </div>
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      {showNewKeyForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Create New API Key
          </h2>
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div>
              <label
                htmlFor="keyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Key Name (Description)
              </label>
              <input
                id="keyName"
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Development Key, Production Key"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewKeyForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={creatingKey}>
                Create API Key
              </Button>
            </div>
          </form>
        </div>
      )}

      {newKeyData && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 md:p-8 mb-8">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
            <div>
              <h3 className="font-semibold text-green-800">
                API Key Created Successfully
              </h3>
              <p className="text-green-700 mt-1 text-sm">
                Make sure to copy your API key now. You won&apos;t be able to
                see it again!
              </p>
              <div className="mt-3 p-3 bg-white rounded-md flex items-center justify-between">
                <code className="text-sm font-mono break-all">
                  {newKeyData.key}
                </code>
                <button
                  onClick={() => copyToClipboard(newKeyData.key, newKeyData.id)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  title="Copy to clipboard"
                >
                  {copiedId === newKeyData.id ? (
                    <span className="text-green-500 text-xs">Copied!</span>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Your API Keys
        </h2>
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
                  API Key
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
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
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {keys.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No API keys found. Create your first API key to get started.
                  </td>
                </tr>
              ) : (
                keys.map((key) => (
                  <tr key={key.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {key.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <code className="text-xs font-mono text-gray-500">
                          {key.key.substring(0, 8)}...
                        </code>
                        <button
                          onClick={() => copyToClipboard(key.key, key.id)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          title="Copy to clipboard"
                        >
                          {copiedId === key.id ? (
                            <span className="text-green-500 text-xs">
                              Copied!
                            </span>
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(key.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {key.expires_at
                          ? new Date(key.expires_at).toLocaleDateString()
                          : "Never"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {key.is_active ? (
                        <button
                          onClick={() => handleToggleActivation(key.id, false)}
                          className="text-red-600 hover:text-red-900 mr-4"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleActivation(key.id, true)}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
