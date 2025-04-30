import { useState } from "react";
import { ClipboardCopy, Check, X } from "lucide-react";

interface NewKeyDisplayProps {
  apiKey: string;
  keyName: string;
  onDismiss: () => void;
}

export default function NewKeyDisplay({
  apiKey,
  keyName,
  onDismiss,
}: NewKeyDisplayProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-800/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-green-800">
            New API Key Created: {keyName}
          </h3>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-500 transition-colors"
            aria-label="Dismiss"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-white p-4 rounded border border-green-300 flex items-center mb-4 relative">
            <pre className="font-mono text-sm break-all whitespace-pre-wrap mr-10 overflow-x-auto">
              {apiKey}
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute right-3 p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center"
              title="Copy to clipboard"
            >
              {copySuccess ? (
                <>
                  <Check size={16} className="mr-1" /> Copied!
                </>
              ) : (
                <>
                  <ClipboardCopy size={16} className="mr-1" /> Copy
                </>
              )}
            </button>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> Make sure to save this key now.
                  For security reasons, you won&apos;t be able to see it again.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-green-800 mb-2">
              How to use this API key
            </h4>
            <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm overflow-x-auto">
              <code>
                curl -X POST http://localhost:5000/detect \<br />
                &nbsp;&nbsp;-H &quot;X-API-Key: {apiKey}&quot; \<br />
                &nbsp;&nbsp;-F &quot;image=@your-image.jpg&quot;
              </code>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onDismiss}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
