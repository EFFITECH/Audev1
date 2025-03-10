import React, { useState } from 'react';
import { File, Download, X } from 'lucide-react';

type PdfViewerProps = {
  fileName: string;
  fileUrl: string;
};

const PdfViewer: React.FC<PdfViewerProps> = ({ fileName, fileUrl }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center">
          <File className="h-6 w-6 text-blue-500 mr-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
            {fileName}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={togglePreview}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
            title="Prévisualiser"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={downloadPdf}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1"
            title="Télécharger"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {fileName}
              </h3>
              <button
                onClick={togglePreview}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <iframe
                src={`${fileUrl}#toolbar=1`}
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            </div>
            <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-2">
              <button
                onClick={downloadPdf}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <Download size={16} className="mr-2" />
                Télécharger
              </button>
              <button
                onClick={togglePreview}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;