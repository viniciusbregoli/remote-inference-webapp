import { useState } from "react";
import { ClipboardCopy, Check } from "lucide-react";

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
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-green-800">
          New API Key Created: {keyName}
        </h3>
        <button
          onClick={onDismiss}
          className="text-green-700 hover:text-green-900"
          aria-label="Dismiss"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="bg-white p-4 rounded border border-green-300 flex items-center mb-4 relative">
        <pre className="font-mono text-sm break-all whitespace-pre-wrap mr-10 overflow-x-auto">
          {apiKey}
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute right-3 p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center"
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
              <strong>Important:</strong> Make sure to save this key now. For
              security reasons, you won't be able to see it again.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-medium text-green-800 mb-2">
          How to use this API key
        </h4>
        <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm overflow-x-auto">
          <code>
            curl -X POST https://api.example.com/detect \<br />
            &nbsp;&nbsp;-H "X-API-Key: {apiKey}" \<br />
            &nbsp;&nbsp;-F "image=@your-image.jpg"
          </code>
        </div>
      </div>

      <button
        onClick={onDismiss}
        className="mt-4 text-green-700 hover:text-green-900 text-sm font-medium"
      >
        Dismiss
      </button>
    </div>
  );
}
