import React, { useState, FormEvent } from 'react';
import { Supplier } from '../types';

type SupplierFormProps = {
  onSubmit: (supplier: Partial<Supplier>) => void;
  onCancel: () => void;
  initialData?: Partial<Supplier>;
};

const SupplierForm: React.FC<SupplierFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData 
}) => {
  const [form, setForm] = useState<Partial<Supplier>>(
    initialData || {
      name: '',
      contact: '',
      bankInfo: '',
      category: ''
    }
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom
        </label>
        <input 
          type="text" 
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          placeholder="Nom du fournisseur" 
          value={form.name || ''} 
          onChange={(e) => setForm({...form, name: e.target.value})}
          required 
        />
      </div>
      
      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
          Contact
        </label>
        <input 
          type="text" 
          id="contact"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          placeholder="Email ou téléphone" 
          value={form.contact || ''} 
          onChange={(e) => setForm({...form, contact: e.target.value})}
        />
      </div>
      
      <div>
        <label htmlFor="bankInfo" className="block text-sm font-medium text-gray-700">
          Informations Bancaires
        </label>
        <input 
          type="text" 
          id="bankInfo"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          placeholder="IBAN ou RIB" 
          value={form.bankInfo || ''} 
          onChange={(e) => setForm({...form, bankInfo: e.target.value})}
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Catégorie
        </label>
        <input 
          type="text" 
          id="category"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          placeholder="Type de fournisseur" 
          value={form.category || ''} 
          onChange={(e) => setForm({...form, category: e.target.value})}
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

export default SupplierForm;