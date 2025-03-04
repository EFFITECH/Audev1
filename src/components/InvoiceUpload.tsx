import React, { useState, ChangeEvent } from 'react';
import { FileUp } from 'lucide-react';

type InvoiceUploadProps = {
  onUpload: (file: File) => void;
  onCancel: () => void;
};

const InvoiceUpload: React.FC<InvoiceUploadProps> = ({ onUpload, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Seuls les fichiers PDF sont autorisés');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setError('');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onUpload(file);
    } else {
      setError('Veuillez sélectionner un fichier PDF');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4 flex text-sm leading-6 text-gray-600">
          <label
            htmlFor="invoice-file"
            className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
          >
            <span>Sélectionner un fichier</span>
            <input
              id="invoice-file"
              name="invoice-file"
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
          <p className="pl-1">ou glisser-déposer</p>
        </div>
        <p className="text-xs leading-5 text-gray-600">PDF uniquement</p>
        
        {file && (
          <div className="mt-4 p-2 bg-blue-50 rounded-md flex items-center justify-between">
            <span className="text-sm text-blue-700 truncate max-w-xs">{file.name}</span>
            <button 
              type="button" 
              onClick={() => setFile(null)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      
      <div className="flex justify-end space-x-2 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
        <button 
          type="submit"
          disabled={!file}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            file ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
          }`}
        >
          Importer
        </button>
      </div>
    </form>
  );
};

export default InvoiceUpload;

export default InvoiceUpload;