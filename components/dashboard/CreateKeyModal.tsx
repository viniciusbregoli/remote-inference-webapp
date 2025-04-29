import { useState } from "react";
import Button from "../ui/Button";
import { X } from "lucide-react";

interface CreateKeyModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (name: string, expirationDate?: string) => void;
}

export default function CreateKeyModal({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}: CreateKeyModalProps) {
  const [keyName, setKeyName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(keyName, expirationDate || undefined);
  };

  if (!isOpen) return null;

  // Calculate minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Create New API Key
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="keyName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Key Name*
            </label>
            <input
              id="keyName"
              type="text"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. Development API Key"
            />
            <p className="mt-1 text-sm text-gray-500">
              Give your API key a descriptive name to identify its purpose.
            </p>
          </div>

          <div>
            <label
              htmlFor="expiration"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Expiration Date (Optional)
            </label>
            <input
              id="expiration"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              min={minDate}
            />
            <p className="mt-1 text-sm text-gray-500">
              If not set, the API key will never expire.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <Button type="submit" isLoading={isLoading} disabled={!keyName}>
              Generate API Key
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
