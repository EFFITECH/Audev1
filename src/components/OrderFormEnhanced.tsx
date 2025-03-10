import React, { useState } from 'react';
import { Plus } from 'lucide-react';

type Supplier = {
  id: number;
  name: string;
  contact?: string;
  category?: string;
};

type Project = {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
};

type Client = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

type OrderFormEnhancedProps = {
  suppliers: Supplier[];
  projects: Project[];
  clients: Client[];
  onSubmit: (orderData: any) => void;
  onCancel: () => void;
  onAddSupplier: (supplier: Supplier) => void;
  onAddProject: (project: Project) => void;
  onAddClient: (client: Client) => void;
};

const OrderFormEnhanced: React.FC<OrderFormEnhancedProps> = ({ 
  suppliers, 
  projects, 
  clients,
  onSubmit, 
  onCancel,
  onAddSupplier,
  onAddProject,
  onAddClient
}) => {
  const [orderData, setOrderData] = useState({
    orderNumber: '',
    date: new Date().toISOString().split('T')[0],
    clientId: '',
    supplierId: '',
    projectId: '',
    totalTTC: '',
    paymentDueDate: '',
    status: 'en attente'
  });

  // États pour les nouveaux fournisseurs et projets
  const [showNewSupplierForm, setShowNewSupplierForm] = useState(false);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    category: 'Matériel'
  });
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'en cours'
  });
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewSupplierChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({ ...prev, [name]: value }));
  };

  const handleNewProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleNewClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewSupplier = () => {
    const supplier = {
      ...newSupplier,
      id: Date.now()
    };
    onAddSupplier(supplier);
    setOrderData(prev => ({ ...prev, supplierId: supplier.id.toString() }));
    setShowNewSupplierForm(false);
    setNewSupplier({ name: '', contact: '', category: 'Matériel' });
  };

  const handleAddNewProject = () => {
    const project = {
      ...newProject,
      id: Date.now()
    };
    onAddProject(project);
    setOrderData(prev => ({ ...prev, projectId: project.id.toString() }));
    setShowNewProjectForm(false);
    setNewProject({ 
      name: '', 
      description: '', 
      startDate: new Date().toISOString().split('T')[0], 
      status: 'en cours' 
    });
  };

  const handleAddNewClient = () => {
    const client = {
      ...newClient,
      id: Date.now(),
      notes: '',
      createdAt: new Date().toISOString()
    };
    onAddClient(client);
    setOrderData(prev => ({ ...prev, clientId: client.id.toString() }));
    setShowNewClientForm(false);
    setNewClient({ 
      name: '', 
      email: '', 
      phone: '',
      address: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the supplier name based on the selected ID
    const supplier = suppliers.find(s => s.id.toString() === orderData.supplierId);
    
    // Find the project name based on the selected ID
    const project = projects.find(p => p.id.toString() === orderData.projectId);
    
    // Find the client based on the selected ID
    const client = clients.find(c => c.id.toString() === orderData.clientId);
    
    if (!client) {
      alert("Veuillez sélectionner un client");
      return;
    }
    
    const formattedData = {
      ...orderData,
      clientId: parseInt(orderData.clientId),
      supplier: supplier ? supplier.name : '',
      project: project ? project.name : undefined,
      totalTTC: parseFloat(orderData.totalTTC),
      paymentStatus: 'non payé',
      id: Date.now() // Generate a temporary ID
    };
    
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Numéro de commande
        </label>
        <input
          type="text"
          name="orderNumber"
          value={orderData.orderNumber}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="CMD-XXX"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={orderData.date}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      
      {/* Client avec option d'ajout */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Client
          </label>
          <button
            type="button"
            onClick={() => setShowNewClientForm(!showNewClientForm)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
          >
            <Plus size={16} className="mr-1" />
            {showNewClientForm ? 'Annuler' : 'Nouveau client'}
          </button>
        </div>
        
        {!showNewClientForm ? (
          <select
            name="clientId"
            value={orderData.clientId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Sélectionner un client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="space-y-3 p-3 border border-blue-200 dark:border-blue-800 rounded-md bg-blue-50 dark:bg-blue-900/20">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom du client
              </label>
              <input
                type="text"
                name="name"
                value={newClient.name}
                onChange={handleNewClientChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nom du client ou de l'entreprise"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={newClient.email}
                onChange={handleNewClientChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="email@exemple.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={newClient.phone}
                onChange={handleNewClientChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="01 23 45 67 89"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Adresse
              </label>
              <input
                type="text"
                name="address"
                value={newClient.address}
                onChange={handleNewClientChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Adresse complète"
              />
            </div>
            
            <button
              type="button"
              onClick={handleAddNewClient}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ajouter ce client
            </button>
          </div>
        )}
      </div>
      
      {/* Fournisseur avec option d'ajout */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Fournisseur
          </label>
          <button
            type="button"
            onClick={() => setShowNewSupplierForm(!showNewSupplierForm)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
          >
            <Plus size={16} className="mr-1" />
            {showNewSupplierForm ? 'Annuler' : 'Nouveau fournisseur'}
          </button>
        </div>
        
        {!showNewSupplierForm ? (
          <select
            name="supplierId"
            value={orderData.supplierId}
            onChange={handleChange}
            required={!showNewSupplierForm}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Sélectionner un fournisseur</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="space-y-3 p-3 border border-blue-200 dark:border-blue-800 rounded-md bg-blue-50 dark:bg-blue-900/20">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom du fournisseur
              </label>
              <input
                type="text"
                name="name"
                value={newSupplier.name}
                onChange={handleNewSupplierChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nom du fournisseur"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact
              </label>
              <input
                type="text"
                name="contact"
                value={newSupplier.contact}
                onChange={handleNewSupplierChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Email ou téléphone"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie
              </label>
              <select
                name="category"
                value={newSupplier.category}
                onChange={handleNewSupplierChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Matériel">Matériel</option>
                <option value="Services">Services</option>
                <option value="Consommables">Consommables</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            
            <button
              type="button"
              onClick={handleAddNewSupplier}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ajouter ce fournisseur
            </button>
          </div>
        )}
      </div>
      
      {/* Projet avec option d'ajout */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Projet (optionnel)
          </label>
          <button
            type="button"
            onClick={() => setShowNewProjectForm(!showNewProjectForm)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
          >
            <Plus size={16} className="mr-1" />
            {showNewProjectForm ? 'Annuler' : 'Nouveau projet'}
          </button>
        </div>
        
        {!showNewProjectForm ? (
          <select
            name="projectId"
            value={orderData.projectId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Aucun projet</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="space-y-3 p-3 border border-blue-200 dark:border-blue-800 rounded-md bg-blue-50 dark:bg-blue-900/20">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom du projet
              </label>
              <input
                type="text"
                name="name"
                value={newProject.name}
                onChange={handleNewProjectChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nom du projet"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={newProject.description}
                onChange={handleNewProjectChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Description du projet"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de début
              </label>
              <input
                type="date"
                name="startDate"
                value={newProject.startDate}
                onChange={handleNewProjectChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                name="status"
                value={newProject.status}
                onChange={handleNewProjectChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="en cours">En cours</option>
                <option value="terminé">Terminé</option>
                <option value="en pause">En pause</option>
                <option value="annulé">Annulé</option>
              </select>
            </div>
            
            <button
              type="button"
              onClick={handleAddNewProject}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ajouter ce projet
            </button>
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Total TTC (€)
        </label>
        <input
          type="number"
          name="totalTTC"
          value={orderData.totalTTC}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="0.00"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date d'échéance de paiement
        </label>
        <input
          type="date"
          name="paymentDueDate"
          value={orderData.paymentDueDate}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Statut
        </label>
        <select
          name="status"
          value={orderData.status}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="en attente">En attente</option>
          <option value="envoyée">Envoyée</option>
          <option value="reçue">Reçue</option>
          <option value="partiellement reçue">Partiellement reçue</option>
        </select>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Ajouter
        </button>
      </div>
    </form>
  );
};

export default OrderFormEnhanced;