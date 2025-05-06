import { useState, useEffect, useCallback } from "react";
import Button from "../ui/Button";
import UserSelector from "./UserSelector";
import { X } from "lucide-react";

interface CreateKeyModalProps {
  isOpen: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  defaultUserId?: number | null;
  onClose: () => void;
  onSubmit: (name: string, userId: number, expirationDate?: string) => void;
}

export default function CreateKeyModal({
  isOpen,
  isLoading,
  isAdmin,
  defaultUserId = null,
  onClose,
  onSubmit,
}: CreateKeyModalProps) {
  const [keyName, setKeyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    defaultUserId
  );
  const [expirationDate, setExpirationDate] = useState("");

  // Add validation state
  const [errors, setErrors] = useState<{
    keyName?: string;
    expirationDate?: string;
    selectedUserId?: string;
  }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const resetForm = useCallback(() => {
    setKeyName("");
    // Only reset the selectedUserId if no defaultUserId was provided
    if (!defaultUserId) {
      setSelectedUserId(null);
    }
    setExpirationDate("");
    setErrors({});
  }, [
    defaultUserId,
    setKeyName,
    setSelectedUserId,
    setExpirationDate,
    setErrors,
  ]);

  // Reset form when modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      // If opening, set the default userId but reset other fields
      resetForm();
      setSelectedUserId(defaultUserId);
    } else {
      // If closing, reset everything
      resetForm();
    }
  }, [isOpen, defaultUserId, resetForm]);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors: {
      keyName?: string;
      expirationDate?: string;
      selectedUserId?: string;
    } = {};

    // Key name validation
    if (!keyName) {
      newErrors.keyName = "Key name is required";
    } else if (keyName.length < 3) {
      newErrors.keyName = "Key name must be at least 3 characters";
    } else if (keyName.length > 50) {
      newErrors.keyName = "Key name must be less than 50 characters";
    }

    // User ID validation
    if (!selectedUserId) {
      newErrors.selectedUserId = "Please select a user";
    }

    // Expiration date validation (optional)
    if (expirationDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = new Date(expirationDate);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.expirationDate = "Expiration date must be in the future";
      }
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [keyName, selectedUserId, expirationDate, setErrors, setIsFormValid]);

  // Validate form whenever inputs change
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form again before submitting
    validateForm();

    if (isFormValid && selectedUserId) {
      onSubmit(keyName, selectedUserId, expirationDate || undefined);
      // Don't reset the form here - let the parent component control the modal
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  // Calculate minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-800/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Create New API Key
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 transition-colors focus:outline-none"
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
              className={`w-full px-3 py-2 border ${
                errors.keyName ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="e.g. Development API Key"
            />
            {errors.keyName ? (
              <p className="mt-1 text-sm text-red-600">{errors.keyName}</p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">
                Give your API key a descriptive name to identify its purpose.
              </p>
            )}
          </div>

          {/* User selector (only visible for admins) */}
          {isAdmin && (
            <div>
              <UserSelector
                selectedUserId={selectedUserId}
                onSelectUser={setSelectedUserId}
              />
              {errors.selectedUserId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.selectedUserId}
                </p>
              )}
            </div>
          )}

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
              className={`w-full px-3 py-2 border ${
                errors.expirationDate ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              min={minDate}
            />
            {errors.expirationDate ? (
              <p className="mt-1 text-sm text-red-600">
                {errors.expirationDate}
              </p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">
                If not set, the API key will never expire.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!isFormValid || isLoading}
            >
              Generate API Key
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
