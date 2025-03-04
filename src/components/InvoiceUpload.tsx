import React, { useState, ChangeEvent } from 'react';
import { FileUp, Calendar, DollarSign } from 'lucide-react';
import { Order } from '../types';

type InvoiceUploadProps = {
  onUpload: (file: File, invoiceData: { orderId: number, amount: number, dueDate: string }) => void;
  onCancel: () => void;
  orders: Order[];
  currentOrderId?: number;
};

const InvoiceUpload: React.FC<InvoiceUploadProps> = ({ 
  onUpload, 
  onCancel, 
  orders,
  currentOrderId 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<number>(currentOrderId || 0);
  const [amount, setAmount] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

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
    
    if (!file) {
      setError('Veuillez sélectionner un fichier PDF');
      return;
    }
    
    if (!orderId) {
      setError('Veuillez sélectionner une commande associée');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }
    
    if (!dueDate) {
      setError('Veuillez sélectionner une date d\'échéance');
      return;
    }
    
    onUpload(file, {
      orderId,
      amount: parseFloat(amount),
      dueDate
    });
  };

  // Auto-fill amount if order is selected
  const handleOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOrderId = parseInt(e.target.value);
    setOrderId(selectedOrderId);
    
    if (selectedOrderId && !amount) {
      const selectedOrder = orders.find(order => order.id === selectedOrderId);
      if (selectedOrder) {
        setAmount(selectedOrder.totalTTC.toString());
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'
        }`}
      >
        <FileUp className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
          <label
            htmlFor="invoice-file"
            className="relative cursor-pointer rounded-md bg-white dark:bg-gray-800 font-semibold text-blue-600 dark:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 dark:hover:text-blue-300"
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
        <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">PDF uniquement</p>
        
        {file && (
          <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center justify-between">
            <span className="text-sm text-blue-700 dark:text-blue-300 truncate max-w-xs">{file.name}</span>
            <button 
              type="button" 
              onClick={() => setFile(null)}
              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="order-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Commande associée
          </label>
          <div className="relative rounded-md shadow-sm">
            <select
              id="order-id"
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
              value={orderId || ''}
              onChange={handleOrderChange}
              required
              disabled={!!currentOrderId}
            >
              <option value="">Sélectionner une commande</option>
              {orders.map(order => (
                <option key={order.id} value={order.id}>
                  {order.orderNumber} - {order.date} ({order.totalTTC.toFixed(2)} €)
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Montant
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DollarSign size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="number"
              id="amount"
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white pl-10 py-2 pr-12 focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 dark:text-gray-400">€</span>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date d'échéance
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="date"
              id="due-date"
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white pl-10 py-2 focus:border-blue-500 focus:ring-blue-500"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      
      <div className="flex justify-end space-x-2 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Annuler
        </button>
        <button 
          type="submit"
          disabled={!file}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            file ? 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600' : 'bg-blue-400 dark:bg-blue-800 cursor-not-allowed'
          }`}
        >
          Importer
        </button>
      </div>
    </form>
  );
};

export default InvoiceUpload;