import { Detection } from "@/types";
import { CheckCircle, Clock, XCircle, UploadCloud } from "lucide-react";

interface Props {
  detectionResult: Detection | null;
  isLoading: boolean;
}

export default function DetectionResultDisplay({
  detectionResult,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <Clock className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-lg font-semibold text-gray-700">
          Detecting objects...
        </p>
        <p className="text-sm text-gray-500">
          Please wait while we analyze your image.
        </p>
      </div>
    );
  }

  if (detectionResult) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
          <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
          Detection Complete
        </h2>
        <div className="bg-gray-800 text-white rounded-lg p-4 my-4 overflow-x-auto">
          <pre>
            <code>{JSON.stringify(detectionResult, null, 2)}</code>
          </pre>
        </div>
      </div>
    );
  }

  if (!detectionResult && !isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">Awaiting Image</h3>
        <p className="text-sm text-gray-500">
          Upload an image and click "Detect Objects" to see the results here.
        </p>
      </div>
    );
  }

  return null;
}
