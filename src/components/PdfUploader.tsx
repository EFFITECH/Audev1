import React, { useState, useRef } from 'react';
import { Upload, File, X, Eye } from 'lucide-react';

type PdfUploaderProps = {
  onFileSelect: (file: File) => void;
  existingFileName?: string;
};

const PdfUploader: React.FC<PdfUploaderProps> = ({ onFileSelect, existingFileName }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Vérifier si le fichier est un PDF
      if (file.type !== 'application/pdf') {
        alert('Veuillez sélectionner un fichier PDF');
        return;
      }
      
      setSelectedFile(file);
      onFileSelect(file);
      
      // Créer une URL pour la prévisualisation
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Vérifier si le fichier est un PDF
      if (file.type !== 'application/pdf') {
        alert('Veuillez sélectionner un fichier PDF');
        return;
      }
      
      setSelectedFile(file);
      onFileSelect(file);
      
      // Créer une URL pour la prévisualisation
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          selectedFile ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-700'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden"
        />
        
        {!selectedFile && !existingFileName ? (
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Glissez-déposez un fichier PDF ici, ou{' '}
              <button
                type="button"
                onClick={openFileSelector}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                parcourez
              </button>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              PDF uniquement, max 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <File className="h-8 w-8 text-green-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedFile ? selectedFile.name : existingFileName}
              </span>
            </div>
            <div className="flex justify-center space-x-2">
              {previewUrl && (
                <button
                  type="button"
                  onClick={togglePreview}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                >
                  <Eye size={16} className="mr-1" />
                  Prévisualiser
                </button>
              )}
              <button
                type="button"
                onClick={clearSelection}
                className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center"
              >
                <X size={16} className="mr-1" />
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isPreviewOpen && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Prévisualisation du PDF
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
                src={`${previewUrl}#toolbar=0`}
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            </div>
            <div className="p-4 border-t dark:border-gray-700 flex justify-end">
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

export default PdfUploader;