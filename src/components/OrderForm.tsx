import React, { useState, useEffect } from 'react';
import { Order, Supplier, Project } from '../types';

type OrderFormProps = {
  order?: Order;
  suppliers: Supplier[];
  projects: Project[];
  onSubmit: (order: Order) => void;
  onCancel: () => void;
};

export const OrderForm: React.FC<OrderFormProps> = ({
  order,
  suppliers,
  projects,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Order>({
    id: order?.id || 0,
    orderNumber: order?.orderNumber || '',
    date: order?.date || new Date().toISOString().split('T')[0],
    supplierId: order?.supplierId || (suppliers.length > 0 ? suppliers[0].id : 0),
    projectId: order?.projectId || null,
    status: order?.status || 'en attente',
    totalHT: order?.totalHT || 0,
    tva: order?.tva || 0,
    totalTTC: order?.totalTTC || 0,
    paymentStatus: order?.paymentStatus || 'non payé',
    paymentDueDate: order?.paymentDueDate || '',
    notes: order?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Automatically calculate TVA (20%) and TTC when totalHT changes
  useEffect(() => {
    const tva = formData.totalHT * 0.2;
    const totalTTC = formData.totalHT + tva;
    
    setFormData(prev => ({
      ...prev,
      tva,
      totalTTC,
    }));
  }, [formData.totalHT]);

  // Generate a default payment due date (30 days after order date) if not set
  useEffect(() => {
    if (formData.date && !formData.paymentDueDate) {
      const orderDate = new Date(formData.date);
      const dueDate = new Date(orderDate);
      dueDate.setDate(dueDate.getDate() + 30);
      
      setFormData(prev => ({
        ...prev,
        paymentDueDate: dueDate.toISOString().split('T')[0],
      }));
    }
  }, [formData.date]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (name === 'totalHT') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'supplierId') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else if (name === 'projectId') {
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value, 10) : null }));
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = 'Le numéro de commande est requis';
    }
    
    if (!formData.date) {
      newErrors.date = 'La date de commande est requise';
    }
    
    if (!formData.supplierId) {
      newErrors.supplierId = 'Un fournisseur doit être sélectionné';
    }
    
    if (formData.totalHT <= 0) {
      newErrors.totalHT = 'Le montant HT doit être supérieur à 0';
    }
    
    if (!formData.paymentDueDate) {
      newErrors.paymentDueDate = 'La date d\'échéance est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Generate a unique order number if creating a new order
  useEffect(() => {
    if (!order && !formData.orderNumber) {
      const today = new Date();
      const year = today.getFullYear().toString().slice(-2);
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      setFormData(prev => ({
        ...prev,
        orderNumber: `CMD-${year}${month}-${random}`,
      }));
    }
  }, [order, formData.orderNumber]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold dark:text-dark-text mb-4">
        {order ? 'Modifier la commande' : 'Ajouter une commande'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Numéro de commande *
          </label>
          <input
            type="text"
            id="orderNumber"
            name="orderNumber"
            value={formData.orderNumber}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.orderNumber ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.orderNumber && <p className="mt-1 text-sm text-red-500">{errors.orderNumber}</p>}
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Date de commande *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.date ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Fournisseur *
          </label>
          <select
            id="supplierId"
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.supplierId ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          >
            {suppliers.length === 0 ? (
              <option value="">Aucun fournisseur disponible</option>
            ) : (
              suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))
            )}
          </select>
          {errors.supplierId && <p className="mt-1 text-sm text-red-500">{errors.supplierId}</p>}
        </div>
        
        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Projet (optionnel)
          </label>
          <select
            id="projectId"
            name="projectId"
            value={formData.projectId || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          >
            <option value="">Aucun projet</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="totalHT" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Montant HT (€) *
          </label>
          <input
            type="number"
            id="totalHT"
            name="totalHT"
            value={formData.totalHT}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.totalHT ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.totalHT && <p className="mt-1 text-sm text-red-500">{errors.totalHT}</p>}
        </div>
        
        <div>
          <label htmlFor="tva" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            TVA (€)
          </label>
          <input
            type="number"
            id="tva"
            name="tva"
            value={formData.tva.toFixed(2)}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-dark-text dark:border-dark-border"
          />
        </div>
        
        <div>
          <label htmlFor="totalTTC" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Montant TTC (€)
          </label>
          <input
            type="number"
            id="totalTTC"
            name="totalTTC"
            value={formData.totalTTC.toFixed(2)}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-dark-text dark:border-dark-border"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Statut de la commande
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          >
            <option value="en attente">En attente</option>
            <option value="confirmée">Confirmée</option>
            <option value="expédiée">Expédiée</option>
            <option value="livrée">Livrée</option>
            <option value="annulée">Annulée</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Statut de paiement
          </label>
          <select
            id="paymentStatus"
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          >
            <option value="non payé">Non payé</option>
            <option value="partiellement payé">Partiellement payé</option>
            <option value="payé">Payé</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="paymentDueDate" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
          Date d'échéance de paiement *
        </label>
        <input
          type="date"
          id="paymentDueDate"
          name="paymentDueDate"
          value={formData.paymentDueDate}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
            errors.paymentDueDate ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.paymentDueDate && <p className="mt-1 text-sm text-red-500">{errors.paymentDueDate}</p>}
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
        />
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
          {order ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};