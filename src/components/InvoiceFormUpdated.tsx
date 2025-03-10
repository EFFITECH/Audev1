import React, { useState, useEffect } from 'react';
import { Invoice, Order } from '../types';

type InvoiceFormProps = {
  invoice?: Invoice;
  order?: Order;
  orders?: Order[];
  onSubmit: (invoice: Invoice) => void;
  onCancel: () => void;
};

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  order,
  orders = [],
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Invoice>({
    id: invoice?.id || 0,
    invoiceNumber: invoice?.invoiceNumber || '',
    invoiceDate: invoice?.invoiceDate || new Date().toISOString().split('T')[0],
    orderId: invoice?.orderId || order?.id || 0,
    orderNumber: invoice?.orderNumber || order?.orderNumber || '',
    clientId: invoice?.clientId || order?.clientId || 0,
    clientName: invoice?.clientName || order?.clientName || '',
    description: invoice?.description || '',
    totalAmount: invoice?.totalAmount || (order ? order.totalAmount : 0),
    paymentTerms: invoice?.paymentTerms || '30 jours',
    dueDate: invoice?.dueDate || (order ? order.paymentDueDate : ''),
    status: invoice?.status || 'PENDING',
    pdfUrl: invoice?.pdfUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);

  // Generate a unique invoice number if creating a new invoice
  useEffect(() => {
    if (!invoice && !formData.invoiceNumber) {
      const today = new Date();
      const year = today.getFullYear().toString().slice(-2);
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      setFormData(prev => ({
        ...prev,
        invoiceNumber: `FACT-${year}${month}-${random}`,
      }));
    }
  }, [invoice, formData.invoiceNumber]);

  // Update order-related fields when order selection changes
  useEffect(() => {
    if (!invoice && orders.length > 0 && formData.orderId) {
      const selectedOrder = orders.find(o => o.id === formData.orderId);
      if (selectedOrder) {
        setFormData(prev => ({
          ...prev,
          orderNumber: selectedOrder.orderNumber,
          clientId: selectedOrder.clientId,
          clientName: selectedOrder.clientName,
          totalAmount: selectedOrder.totalAmount,
          dueDate: selectedOrder.paymentDueDate,
        }));
      }
    }
  }, [formData.orderId, invoice, orders]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (name === 'totalAmount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'orderId') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      
      // Clear file error if exists
      if (errors.pdfUrl) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.pdfUrl;
          return newErrors;
        });
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Le numéro de facture est requis';
    }
    
    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'La date de facture est requise';
    }
    
    if (!formData.orderId) {
      newErrors.orderId = 'Une commande doit être associée';
    }
    
    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = 'Le montant doit être supérieur à 0';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'La date d\'échéance est requise';
    }
    
    // If it's a new invoice and no file is selected
    if (!invoice && !file && !formData.pdfUrl) {
      newErrors.pdfUrl = 'Un fichier de facture est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // In a real application, you would upload the file here
      // and set the pdfUrl to the uploaded file's URL
      // For this example, we'll just set a placeholder URL
      const updatedInvoice = {
        ...formData,
        pdfUrl: file ? URL.createObjectURL(file) : formData.pdfUrl,
      };
      
      onSubmit(updatedInvoice);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold dark:text-dark-text mb-4">
        {invoice ? 'Modifier la facture' : 'Ajouter une facture'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Numéro de facture *
          </label>
          <input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.invoiceNumber ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.invoiceNumber && <p className="mt-1 text-sm text-red-500">{errors.invoiceNumber}</p>}
        </div>
        
        <div>
          <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Date de facture *
          </label>
          <input
            type="date"
            id="invoiceDate"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.invoiceDate ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.invoiceDate && <p className="mt-1 text-sm text-red-500">{errors.invoiceDate}</p>}
        </div>
      </div>
      
      {!order && orders.length > 0 && (
        <div>
          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Commande associée *
          </label>
          <select
            id="orderId"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.orderId ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
            disabled={!!order}
          >
            <option value="">Sélectionnez une commande</option>
            {orders.map(o => (
              <option key={o.id} value={o.id}>
                {o.orderNumber} - {o.clientName} ({o.totalAmount.toFixed(2)} €)
              </option>
            ))}
          </select>
          {errors.orderId && <p className="mt-1 text-sm text-red-500">{errors.orderId}</p>}
        </div>
      )}
      
      {!order && !orders.length && (
        <div>
          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Commande associée *
          </label>
          <input
            type="number"
            id="orderId"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.orderId ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.orderId && <p className="mt-1 text-sm text-red-500">{errors.orderId}</p>}
        </div>
      )}
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Montant (€) *
          </label>
          <input
            type="number"
            id="totalAmount"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.totalAmount ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.totalAmount && <p className="mt-1 text-sm text-red-500">{errors.totalAmount}</p>}
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Statut de paiement
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          >
            <option value="PENDING">En attente</option>
            <option value="PAID">Payé</option>
            <option value="OVERDUE">En retard</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Conditions de paiement
          </label>
          <input
            type="text"
            id="paymentTerms"
            name="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          />
        </div>
        
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Date d'échéance de paiement *
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.dueDate ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
          Fichier de facture {!invoice && '*'}
        </label>
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
          className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
            errors.pdfUrl ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.pdfUrl && <p className="mt-1 text-sm text-red-500">{errors.pdfUrl}</p>}
        {formData.pdfUrl && (
          <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
            Fichier actuel: {formData.pdfUrl.split('/').pop()}
          </p>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-dark-card dark:text-dark-text dark:border-dark-border dark:hover:bg-gray-700"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {invoice ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};