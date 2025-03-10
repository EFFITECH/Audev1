import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Quote, Client, Project, QuoteItem } from '../types';
import { fetchQuoteById, createQuote, updateQuote, fetchClients, fetchProjects } from '../api';

interface QuoteFormProps {
  onQuoteAdded: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onQuoteAdded }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // État du formulaire
  const [formData, setFormData] = useState<{
    quoteNumber: string;
    clientId: string;
    projectId: string;
    quoteDate: string;
    validUntil: string;
    status: Quote['status'];
    description: string;
    items: QuoteItem[];
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
  }>({
    quoteNumber: `DEVIS-${new Date().getFullYear()}-001`,
    clientId: '',
    projectId: '',
    quoteDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'brouillon',
    description: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, totalHT: 0 }],
    totalHT: 0,
    totalTVA: 0,
    totalTTC: 0
  });
  
  // Chargement des données du devis si on est en mode édition
  useEffect(() => {
    const loadQuote = async () => {
      if (!id) return; // Mode création
      
      try {
        setLoading(true);
        const quoteId = parseInt(id);
        const quote = await fetchQuoteById(quoteId);
        
        if (!quote) {
          setError("Devis non trouvé");
          return;
        }
        
        setFormData({
          quoteNumber: quote.quoteNumber,
          clientId: quote.clientId,
          projectId: quote.projectId || '',
          quoteDate: new Date(quote.quoteDate).toISOString().split('T')[0],
          validUntil: new Date(quote.validUntil).toISOString().split('T')[0],
          status: quote.status,
          description: quote.description,
          items: quote.items,
          totalHT: quote.totalHT,
          totalTVA: quote.totalTVA,
          totalTTC: quote.totalTTC
        });
        
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement du devis:", err);
        setError("Impossible de charger les données du devis");
      } finally {
        setLoading(false);
      }
    };
    
    const loadData = async () => {
      try {
        setLoading(true);
        const [clientsData, projectsData] = await Promise.all([
          fetchClients(),
          fetchProjects()
        ]);
        
        setClients(clientsData);
        setProjects(projectsData);
        
        if (clientsData.length > 0 && formData.clientId === '') {
          setFormData(prev => ({ ...prev, clientId: clientsData[0].id }));
        }
        
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les données nécessaires");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    loadQuote();
  }, [id]);
  
  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Gestion des changements dans les éléments du devis
  const handleItemChange = (index: number, field: keyof QuoteItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculer le total HT de l'élément
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? Number(value) : newItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? Number(value) : newItems[index].unitPrice;
      newItems[index].totalHT = quantity * unitPrice;
    }
    
    // Recalculer les totaux du devis
    const totalHT = newItems.reduce((sum, item) => sum + (item.totalHT || 0), 0);
    const totalTVA = totalHT * 0.2; // TVA à 20%
    const totalTTC = totalHT + totalTVA;
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      totalHT,
      totalTVA,
      totalTTC
    }));
  };
  
  // Ajout d'un nouvel élément au devis
  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, totalHT: 0 }]
    }));
  };
  
  // Suppression d'un élément du devis
  const handleRemoveItem = (index: number) => {
    if (formData.items.length <= 1) return;
    
    const newItems = formData.items.filter((_, i) => i !== index);
    
    // Recalculer les totaux du devis
    const totalHT = newItems.reduce((sum, item) => sum + (item.totalHT || 0), 0);
    const totalTVA = totalHT * 0.2; // TVA à 20%
    const totalTTC = totalHT + totalTVA;
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      totalHT,
      totalTVA,
      totalTTC
    }));
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Trouver le nom du client
      const client = clients.find(c => c.id === formData.clientId);
      if (!client) {
        setError("Client non trouvé");
        setLoading(false);
        return;
      }
      
      // Trouver le nom du projet (si applicable)
      let projectName = '';
      if (formData.projectId) {
        const project = projects.find(p => p.id === formData.projectId);
        if (project) {
          projectName = project.name;
        }
      }
      
      const quoteData = {
        ...formData,
        clientName: client.name,
        projectName
      };
      
      if (id) {
        // Mode édition
        await updateQuote(parseInt(id), quoteData);
      } else {
        // Mode création
        await createQuote(quoteData);
      }
      
      onQuoteAdded();
      navigate('/quotes');
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du devis:", err);
      setError("Impossible d'enregistrer le devis");
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {id ? 'Modifier le devis' : 'Créer un devis'}
      </h2>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="quoteNumber" className="block text-gray-700 dark:text-gray-300 mb-2">
              Numéro de devis
            </label>
            <input
              type="text"
              id="quoteNumber"
              name="quoteNumber"
              value={formData.quoteNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              required
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-gray-700 dark:text-gray-300 mb-2">
              Statut
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              required
            >
              <option value="brouillon">Brouillon</option>
              <option value="envoyé">Envoyé</option>
              <option value="accepté">Accepté</option>
              <option value="refusé">Refusé</option>
              <option value="expiré">Expiré</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="clientId" className="block text-gray-700 dark:text-gray-300 mb-2">
              Client
            </label>
            <select
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              required
            >
              <option value="">Sélectionner un client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="projectId" className="block text-gray-700 dark:text-gray-300 mb-2">
              Projet (optionnel)
            </label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <option value="">Aucun projet</option>
              {projects.filter(p => p.clientId === formData.clientId).map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="quoteDate" className="block text-gray-700 dark:text-gray-300 mb-2">
              Date du devis
            </label>
            <input
              type="date"
              id="quoteDate"
              name="quoteDate"
              value={formData.quoteDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              required
            />
          </div>
          
          <div>
            <label htmlFor="validUntil" className="block text-gray-700 dark:text-gray-300 mb-2">
              Valide jusqu'au
            </label>
            <input
              type="date"
              id="validUntil"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            rows={3}
            required
          />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Éléments du devis</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
            >
              Ajouter un élément
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Description</th>
                  <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">Quantité</th>
                  <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">Prix unitaire (€)</th>
                  <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">Total HT (€)</th>
                  <th className="px-4 py-2 text-center text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-right"
                        min="1"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-right"
                        min="0"
                        step="0.01"
                        required
                      />
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {item.totalHT.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        disabled={formData.items.length <= 1}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td colSpan={3} className="px-4 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">
                    Total HT
                  </td>
                  <td className="px-4 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">
                    {formData.totalHT.toFixed(2)} €
                  </td>
                  <td></td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td colSpan={3} className="px-4 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">
                    TVA (20%)
                  </td>
                  <td className="px-4 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">
                    {formData.totalTVA.toFixed(2)} €
                  </td>
                  <td></td>
                </tr>
                <tr className="bg-gray-100 dark:bg-gray-600">
                  <td colSpan={3} className="px-4 py-2 text-right font-bold text-gray-800 dark:text-white">
                    Total TTC
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-gray-800 dark:text-white">
                    {formData.totalTTC.toFixed(2)} €
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/quotes')}
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

export default QuoteForm;