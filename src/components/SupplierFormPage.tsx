import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Supplier } from '../types';
import { fetchSupplierById, createSupplier, updateSupplier } from '../api';

interface SupplierFormPageProps {
  onSupplierAdded: () => void;
}

const SupplierFormPage: React.FC<SupplierFormPageProps> = ({ onSupplierAdded }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // État du formulaire
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
  }>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  // Chargement des données du fournisseur si on est en mode édition
  useEffect(() => {
    const loadSupplier = async () => {
      if (!id) return; // Mode création
      
      try {
        setLoading(true);
        const supplier = await fetchSupplierById(id);
        
        if (!supplier) {
          setError("Fournisseur non trouvé");
          return;
        }
        
        setFormData({
          name: supplier.name,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address
        });
        
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement du fournisseur:", err);
        setError("Impossible de charger les données du fournisseur");
      } finally {
        setLoading(false);
      }
    };
    
    loadSupplier();
  }, [id]);
  
  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (id) {
        // Mode édition
        await updateSupplier(id, formData);
      } else {
        // Mode création
        await createSupplier(formData);
      }
      
      onSupplierAdded();
      navigate('/suppliers');
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du fournisseur:", err);
      setError("Impossible d'enregistrer le fournisseur");
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {id ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}
      </h2>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
            Nom
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="address" className="block text-gray-700 dark:text-gray-300 mb-2">
            Adresse
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            rows={3}
            required
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/suppliers')}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierFormPage;