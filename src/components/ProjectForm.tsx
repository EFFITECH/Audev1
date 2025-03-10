import React, { useState } from 'react';
import { Project, Client } from '../types';

type ProjectFormProps = {
  project?: Project;
  clients: Client[];
  onSubmit: (project: Project) => void;
  onCancel: () => void;
};

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  clients,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Project>({
    id: project?.id || 0,
    name: project?.name || '',
    description: project?.description || '',
    clientId: project?.clientId || (clients.length > 0 ? clients[0].id : 0),
    status: project?.status || 'en cours',
    startDate: project?.startDate || new Date().toISOString().split('T')[0],
    endDate: project?.endDate || '',
    budget: project?.budget || 0,
    notes: project?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (name === 'budget') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'clientId') {
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du projet est requis';
    }
    
    if (!formData.clientId) {
      newErrors.clientId = 'Un client doit être sélectionné';
    }
    
    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold dark:text-dark-text mb-4">
        {project ? 'Modifier le projet' : 'Ajouter un projet'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Nom du projet *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Client *
          </label>
          <select
            id="clientId"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.clientId ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          >
            {clients.length === 0 ? (
              <option value="">Aucun client disponible</option>
            ) : (
              clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))
            )}
          </select>
          {errors.clientId && <p className="mt-1 text-sm text-red-500">{errors.clientId}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Date de début
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          />
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Date de fin (estimée)
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.endDate ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Statut
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          >
            <option value="en cours">En cours</option>
            <option value="terminé">Terminé</option>
            <option value="en pause">En pause</option>
            <option value="annulé">Annulé</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
          Budget (€)
        </label>
        <input
          type="number"
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          step="0.01"
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
        />
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
          {project ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};