import React, { useState, useEffect } from 'react';
import { ClientOrder, ClientOrderItem, Client, Project, Quote } from '../types';
import { Plus, Trash2 } from 'lucide-react';

type ClientOrderFormProps = {
  order?: ClientOrder;
  clients: Client[];
  projects: Project[];
  quotes: Quote[];
  onSubmit: (order: ClientOrder) => void;
  onCancel: () => void;
};

export const ClientOrderForm: React.FC<ClientOrderFormProps> = ({
  order,
  clients,
  projects,
  quotes,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ClientOrder>({
    id: order?.id || 0,
    orderNumber: order?.orderNumber || '',
    orderDate: order?.orderDate || new Date().toISOString().split('T')[0],
    clientId: order?.clientId || (clients.length > 0 ? clients[0].id || 0 : 0),
    clientName: order?.clientName || (clients.length > 0 ? clients[0].name : ''),
    projectId: order?.projectId || undefined,
    projectName: order?.projectName || '',
    quoteId: order?.quoteId || undefined,
    quoteNumber: order?.quoteNumber || '',
    description: order?.description || '',
    items: order?.items || [{ description: '', quantity: 1, unitPrice: 0, totalHT: 0 }],
    totalHT: order?.totalHT || 0,
    tva: order?.tva || 0,
    totalTTC: order?.totalTTC || 0,
    status: order?.status || 'en attente',
    paymentStatus: order?.paymentStatus || 'non payé',
    paymentDueDate: order?.paymentDueDate || '',
    invoiceId: order?.invoiceId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clientProjects, setClientProjects] = useState<Project[]>([]);
  const [clientQuotes, setClientQuotes] = useState<Quote[]>([]);

  // Générer un numéro de commande unique si c'est une nouvelle commande
  useEffect(() => {
    if (!order && !formData.orderNumber) {
      const today = new Date();
      const year = today.getFullYear().toString();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      setFormData(prev => ({
        ...prev,
        orderNumber: `CMD-${year}${month}-${random}`,
      }));
    }
  }, [order, formData.orderNumber]);

  // Définir la date d'échéance par défaut (30 jours après la date de commande)
  useEffect(() => {
    if (formData.orderDate && !formData.paymentDueDate) {
      const orderDate = new Date(formData.orderDate);
      const dueDate = new Date(orderDate);
      dueDate.setDate(dueDate.getDate() + 30);
      
      setFormData(prev => ({
        ...prev,
        paymentDueDate: dueDate.toISOString().split('T')[0],
      }));
    }
  }, [formData.orderDate]);

  // Filtrer les projets et devis en fonction du client sélectionné
  useEffect(() => {
    if (formData.clientId) {
      const filteredProjects = projects.filter(project => project.clientId === formData.clientId);
      setClientProjects(filteredProjects);
      
      const filteredQuotes = quotes.filter(quote => 
        quote.clientId === formData.clientId && 
        quote.status === 'accepté' && 
        !quote.convertedToOrderId
      );
      setClientQuotes(filteredQuotes);
      
      // Si le projet actuel n'appartient pas au client sélectionné, réinitialiser
      if (formData.projectId && !filteredProjects.some(p => p.id === formData.projectId)) {
        setFormData(prev => ({
          ...prev,
          projectId: undefined,
          projectName: '',
        }));
      }
      
      // Si le devis actuel n'appartient pas au client sélectionné, réinitialiser
      if (formData.quoteId && !filteredQuotes.some(q => q.id === formData.quoteId)) {
        setFormData(prev => ({
          ...prev,
          quoteId: undefined,
          quoteNumber: '',
        }));
      }
    } else {
      setClientProjects([]);
      setClientQuotes([]);
    }
  }, [formData.clientId, projects, quotes]);

  // Remplir les données à partir du devis sélectionné
  useEffect(() => {
    if (formData.quoteId) {
      const selectedQuote = quotes.find(q => q.id === formData.quoteId);
      if (selectedQuote) {
        setFormData(prev => ({
          ...prev,
          quoteNumber: selectedQuote.quoteNumber,
          projectId: selectedQuote.projectId,
          projectName: selectedQuote.projectName || '',
          description: selectedQuote.description,
          items: selectedQuote.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalHT: item.totalHT,
          })),
          totalHT: selectedQuote.totalHT,
          tva: selectedQuote.tva,
          totalTTC: selectedQuote.totalTTC,
        }));
      }
    }
  }, [formData.quoteId, quotes]);

  // Calculer les totaux lorsque les éléments changent
  useEffect(() => {
    const totalHT = formData.items.reduce((sum, item) => sum + item.totalHT, 0);
    const tva = totalHT * 0.2; // TVA à 20%
    const totalTTC = totalHT + tva;
    
    setFormData(prev => ({
      ...prev,
      totalHT,
      tva,
      totalTTC,
    }));
  }, [formData.items]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'clientId') {
      const clientId = parseInt(value, 10);
      const selectedClient = clients.find(c => c.id === clientId);
      
      setFormData(prev => ({
        ...prev,
        clientId,
        clientName: selectedClient?.name || '',
        projectId: undefined,
        projectName: '',
        quoteId: undefined,
        quoteNumber: '',
      }));
    } else if (name === 'projectId') {
      if (value) {
        const projectId = parseInt(value, 10);
        const selectedProject = projects.find(p => p.id === projectId);
        
        setFormData(prev => ({
          ...prev,
          projectId,
          projectName: selectedProject?.name || '',
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          projectId: undefined,
          projectName: '',
        }));
      }
    } else if (name === 'quoteId') {
      if (value) {
        const quoteId = parseInt(value, 10);
        setFormData(prev => ({
          ...prev,
          quoteId,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          quoteId: undefined,
          quoteNumber: '',
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Effacer l'erreur lorsque le champ est modifié
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleItemChange = (index: number, field: keyof ClientOrderItem, value: string | number) => {
    const newItems = [...formData.items];
    
    if (field === 'quantity' || field === 'unitPrice') {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      newItems[index][field] = numValue;
      
      // Recalculer le total de la ligne
      const quantity = field === 'quantity' ? numValue : newItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? numValue : newItems[index].unitPrice;
      newItems[index].totalHT = quantity * unitPrice;
    } else {
      newItems[index][field] = value;
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, totalHT: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      
      setFormData(prev => ({
        ...prev,
        items: newItems,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = 'Le numéro de commande est requis';
    }
    
    if (!formData.orderDate) {
      newErrors.orderDate = 'La date de commande est requise';
    }
    
    if (!formData.clientId) {
      newErrors.clientId = 'Un client doit être sélectionné';
    }
    
    if (!formData.paymentDueDate) {
      newErrors.paymentDueDate = 'La date d\'échéance est requise';
    }
    
    // Vérifier que tous les éléments ont une description et des valeurs valides
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`items[${index}].description`] = 'La description est requise';
      }
      
      if (item.quantity <= 0) {
        newErrors[`items[${index}].quantity`] = 'La quantité doit être supérieure à 0';
      }
      
      if (item.unitPrice < 0) {
        newErrors[`items[${index}].unitPrice`] = 'Le prix unitaire ne peut pas être négatif';
      }
    });
    
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold dark:text-dark-text mb-4">
        {order ? 'Modifier la commande client' : 'Créer une nouvelle commande client'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Date de commande *
          </label>
          <input
            type="date"
            id="orderDate"
            name="orderDate"
            value={formData.orderDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.orderDate ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.orderDate && <p className="mt-1 text-sm text-red-500">{errors.orderDate}</p>}
        </div>
        
        <div>
          <label htmlFor="paymentDueDate" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Date d'échéance *
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Client *
          </label>
          <select
            id="clientId"
            name="clientId"
            value={formData.clientId || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
              errors.clientId ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionnez un client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.clientId && <p className="mt-1 text-sm text-red-500">{errors.clientId}</p>}
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
            disabled={!formData.clientId || clientProjects.length === 0}
          >
            <option value="">Aucun projet</option>
            {clientProjects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {formData.clientId && clientProjects.length === 0 && (
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
              Aucun projet disponible pour ce client
            </p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="quoteId" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
          Basé sur un devis (optionnel)
        </label>
        <select
          id="quoteId"
          name="quoteId"
          value={formData.quoteId || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          disabled={!formData.clientId || clientQuotes.length === 0}
        >
          <option value="">Aucun devis</option>
          {clientQuotes.map(quote => (
            <option key={quote.id} value={quote.id}>
              {quote.quoteNumber} - {new Date(quote.quoteDate).toLocaleDateString()} - {quote.totalTTC.toFixed(2)} €
            </option>
          ))}
        </select>
        {formData.clientId && clientQuotes.length === 0 && (
          <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
            Aucun devis accepté disponible pour ce client
          </p>
        )}
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
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium dark:text-dark-text">Éléments de la commande</h3>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <Plus size={16} className="mr-1" />
            Ajouter un élément
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                  Quantité
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
                  Prix unitaire
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
                  Total HT
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {formData.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className={`w-full px-2 py-1 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
                        errors[`items[${index}].description`] ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Description de l'élément"
                    />
                    {errors[`items[${index}].description`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`items[${index}].description`]}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      min="1"
                      step="1"
                      className={`w-full px-2 py-1 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
                        errors[`items[${index}].quantity`] ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`items[${index}].quantity`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`items[${index}].quantity`]}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      min="0"
                      step="0.01"
                      className={`w-full px-2 py-1 border rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border ${
                        errors[`items[${index}].unitPrice`] ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`items[${index}].unitPrice`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`items[${index}].unitPrice`]}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.totalHT.toFixed(2)}
                      readOnly
                      className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-dark-text dark:border-dark-border"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length <= 1}
                      className={`text-red-500 hover:text-red-700 ${
                        formData.items.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total HT:
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={formData.totalHT.toFixed(2)}
                    readOnly
                    className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-dark-text dark:border-dark-border"
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                  TVA (20%):
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={formData.tva.toFixed(2)}
                    readOnly
                    className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-dark-text dark:border-dark-border"
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total TTC:
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={formData.totalTTC.toFixed(2)}
                    readOnly
                    className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-dark-text dark:border-dark-border font-bold"
                  />
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
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
            <option value="en cours">En cours</option>
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
          {order ? 'Mettre à jour' : 'Créer la commande'}
        </button>
      </div>
    </form>
  );
};