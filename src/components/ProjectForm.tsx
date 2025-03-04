import React, { useState, FormEvent } from 'react';
import { Project } from '../types';

type ProjectFormProps = {
  onSubmit: (project: Partial<Project>) => void;
  onCancel: () => void;
  initialData?: Partial<Project>;
};

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData 
}) => {
  const [form, setForm] = useState<Partial<Project>>(
    initialData || {
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'en cours'
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
          Nom du projet
        </label>
        <input 
          type="text" 
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          placeholder="Nom du projet" 
          value={form.name || ''} 
          onChange={(e) => setForm({...form, name: e.target.value})}
          required 
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea 
          id="description"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          placeholder="Description du projet" 
          value={form.description || ''} 
          onChange={(e) => setForm({...form, description: e.target.value})}
          rows={3}
        />
      </div>
      
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Date de début
        </label>
        <input 
          type="date" 
          id="startDate"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          value={form.startDate || ''} 
          onChange={(e) => setForm({...form, startDate: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          Date de fin (optionnelle)
        </label>
        <input 
          type="date" 
          id="endDate"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          value={form.endDate || ''} 
          onChange={(e) => setForm({...form, endDate: e.target.value || undefined})}
        />
      </div>
      
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Statut
        </label>
        <select 
          id="status"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          value={form.status || 'en cours'} 
          onChange={(e) => setForm({...form, status: e.target.value as Project['status']})}
        >
          <option value="en cours">En cours</option>
          <option value="terminé">Terminé</option>
          <option value="en pause">En pause</option>
          <option value="annulé">Annulé</option>
        </select>
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

export default ProjectForm;