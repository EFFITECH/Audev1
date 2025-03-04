import React, { useState, FormEvent, useEffect } from 'react';
import { Order, Supplier, Project } from '../types';

type OrderFormProps = {
  onSubmit: (order: Partial<Order>) => void;
  onCancel: () => void;
  suppliers: Supplier[];
  projects: Project[];
  initialData?: Partial<Order>;
};

const OrderForm: React.FC<OrderFormProps> = ({ 
  onSubmit, 
  onCancel, 
  suppliers,
  projects,
  initialData 
}) => {
  const [form, setForm] = useState<Partial<Order>>(
    initialData || {
      orderNumber: '',
      date: new Date().toISOString().split('T')[0],
      supplierId: 0,
      projectId: undefined,
      status: 'en attente',
      totalHT: 0,
      tva: 0,
      totalTTC: 0,
      paymentDueDate: '',
      paymentStatus: 'non payé'
    }
  );

  // Set default payment due date to 30 days after order date
  useEffect(() => {
    if (form.date && !form.paymentDueDate) {
      const orderDate = new Date(form.date);
      const dueDate = new Date(orderDate);
      dueDate.setDate(dueDate.getDate() + 30);
      setForm(prev => ({ 
        ...prev, 
        paymentDueDate: dueDate.toISOString().split('T')[0] 
      }));
    }
  }, [form.date]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  // Calculate TTC when HT or TVA changes
  const updateTotalTTC = (ht: number, tva: number) => {
    // Ensure we're working with valid numbers
    const validHT = isNaN(ht) ? 0 : ht;
    const validTVA = isNaN(tva) ? 0 : tva;
    const totalTTC = validHT + validTVA;
    setForm(prev => ({ ...prev, totalHT: validHT, tva: validTVA, totalTTC }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">
          Numéro de Commande
        </label>
        <input 
          type="text" 
          id="orderNumber"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          placeholder="CMD-XXX" 
          value={form.orderNumber || ''} 
          onChange={(e) => setForm({...form, orderNumber: e.target.value})}
          required 
        />
      </div>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input 
          type="date" 
          id="date"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          value={form.date || ''} 
          onChange={(e) => setForm({...form, date: e.target.value})}
          required 
        />
      </div>
      
      <div>
        <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">
          Fournisseur
        </label>
        <select 
          id="supplierId"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          value={form.supplierId || ''} 
          onChange={(e) => setForm({...form, supplierId: parseInt(e.target.value)})}
          required
        >
          <option value="">Sélectionner un Fournisseur</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
          Projet associé
        </label>
        <select 
          id="projectId"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          value={form.projectId || ''} 
          onChange={(e) => setForm({...form, projectId: e.target.value ? parseInt(e.target.value) : undefined})}
        >
          <option value="">Aucun projet associé</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Statut
        </label>
        <select 
          id="status"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          value={form.status || 'en attente'} 
          onChange={(e) => setForm({...form, status: e.target.value as Order['status']})}
        >
          <option value="en attente">En attente</option>
          <option value="envoyée">Envoyée</option>
          <option value="reçue">Reçue</option>
          <option value="partiellement reçue">Partiellement reçue</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="totalHT" className="block text-sm font-medium text-gray-700">
          Total HT
        </label>
        <input 
          type="number" 
          id="totalHT"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          placeholder="0.00" 
          value={form.totalHT === 0 ? "0" : form.totalHT || ""} 
          onChange={(e) => updateTotalTTC(parseFloat(e.target.value), form.tva || 0)}
          step="0.01"
          min="0"
          required 
        />
      </div>
      
      <div>
        <label htmlFor="tva" className="block text-sm font-medium text-gray-700">
          TVA
        </label>
        <input 
          type="number" 
          id="tva"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          placeholder="0.00" 
          value={form.tva === 0 ? "0" : form.tva || ""} 
          onChange={(e) => updateTotalTTC(form.totalHT || 0, parseFloat(e.target.value))}
          step="0.01"
          min="0"
          required 
        />
      </div>
      
      <div>
        <label htmlFor="totalTTC" className="block text-sm font-medium text-gray-700">
          Total TTC
        </label>
        <input 
          type="number" 
          id="totalTTC"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-gray-50"
          placeholder="0.00" 
          value={form.totalTTC === 0 ? "0" : form.totalTTC || ""} 
          readOnly
          step="0.01"
        />
      </div>

      <div>
        <label htmlFor="paymentDueDate" className="block text-sm font-medium text-gray-700">
          Date d'échéance de paiement
        </label>
        <input 
          type="date" 
          id="paymentDueDate"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          value={form.paymentDueDate || ''} 
          onChange={(e) => setForm({...form, paymentDueDate: e.target.value})}
          required 
        />
      </div>
      
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
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {initialData?.id ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;