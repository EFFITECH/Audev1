import React, { useState, useEffect } from 'react';
import { Supplier, Order, Invoice, Project } from './types';
import * as api from './api';
import Modal from './components/Modal';
import SupplierForm from './components/SupplierForm';
import OrderForm from './components/OrderForm';
import ProjectForm from './components/ProjectForm';
import InvoiceUpload from './components/InvoiceUpload';
import { FileText, ShoppingCart, Users, Plus, FileUp, Eye, Briefcase, AlertCircle, Clock } from 'lucide-react';

function App() {
  // Data states
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'suppliers' | 'orders' | 'invoices' | 'projects'>('orders');
  
  // Modal states
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const suppliersData = await api.fetchSuppliers();
      const ordersData = await api.fetchOrders();
      const invoicesData = await api.fetchInvoices();
      const projectsData = await api.fetchProjects();
      
      setSuppliers(suppliersData);
      setOrders(ordersData);
      setInvoices(invoicesData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddSupplier = async (supplierData: Partial<Supplier>) => {
    try {
      await api.addSupplier(supplierData);
      await fetchData();
      setShowSupplierModal(false);
    } catch (error) {
      console.error('Error adding supplier:', error);
      alert('Erreur lors de l\'ajout du fournisseur');
    }
  };

  const handleAddProject = async (projectData: Partial<Project>) => {
    try {
      await api.addProject(projectData);
      await fetchData();
      setShowProjectModal(false);
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Erreur lors de l\'ajout du projet');
    }
  };

  const handleAddOrder = async (orderData: Partial<Order>) => {
    try {
      await api.addOrder(orderData);
      await fetchData();
      setShowOrderModal(false);
    } catch (error) {
      console.error('Error adding order:', error);
      alert('Erreur lors de l\'ajout de la commande');
    }
  };

  const handleUpdateOrderPaymentStatus = async (orderId: number, status: Order['paymentStatus']) => {
    try {
      await api.updateOrderPaymentStatus(orderId, status);
      await fetchData();
      setShowOrderDetailsModal(false);
    } catch (error) {
      console.error('Error updating order payment status:', error);
      alert('Erreur lors de la mise à jour du statut de paiement');
    }
  };

  const handleImportInvoice = async (file: File) => {
    try {
      await api.importInvoicePDF(file);
      await fetchData();
      setShowInvoiceModal(false);
      alert('Facture importée avec succès !');
    } catch (error) {
      console.error('Error importing invoice:', error);
      alert('Erreur lors de l\'importation de la facture');
    }
  };

  const getSupplierName = (supplierId: number) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Inconnu';
  };

  const getProjectName = (projectId?: number) => {
    if (!projectId) return 'Non assigné';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Inconnu';
  };

  const getOrderNumber = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    return order ? order.orderNumber : 'Inconnu';
  };

  const isPaymentDueSoon = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const isPaymentOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const renderSuppliersList = () => (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold">Fournisseurs</h2>
        <button 
          onClick={() => setShowSupplierModal(true)}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
          title="Ajouter un fournisseur"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.length > 0 ? (
              suppliers.map(supplier => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{supplier.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{supplier.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{supplier.category}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  Aucun fournisseur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProjectsList = () => (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold">Projets</h2>
        <button 
          onClick={() => setShowProjectModal(true)}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
          title="Ajouter un projet"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de début</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de fin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.length > 0 ? (
              projects.map(project => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{project.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{project.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{project.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{project.endDate || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${project.status === 'en cours' ? 'bg-blue-100 text-blue-800' : 
                        project.status === 'terminé' ? 'bg-green-100 text-green-800' : 
                        project.status === 'en pause' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Aucun projet trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrdersList = () => (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold">Commandes</h2>
        <button 
          onClick={() => setShowOrderModal(true)}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
          title="Ajouter une commande"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order.id} className={`hover:bg-gray-50 ${
                  order.paymentStatus !== 'payé' && isPaymentOverdue(order.paymentDueDate) 
                    ? 'bg-red-50' 
                    : order.paymentStatus !== 'payé' && isPaymentDueSoon(order.paymentDueDate)
                    ? 'bg-yellow-50'
                    : ''
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.orderNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getSupplierName(order.supplierId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getProjectName(order.projectId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'reçue' ? 'bg-green-100 text-green-800' : 
                        order.status === 'en attente' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'envoyée' ? 'bg-blue-100 text-blue-800' : 
                        'bg-orange-100 text-orange-800'}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.totalTTC.toFixed(2)} €</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {order.paymentStatus !== 'payé' && isPaymentOverdue(order.paymentDueDate) && (
                        <AlertCircle size={16} className="text-red-500 mr-1" />
                      )}
                      {order.paymentStatus !== 'payé' && isPaymentDueSoon(order.paymentDueDate) && !isPaymentOverdue(order.paymentDueDate) && (
                        <Clock size={16} className="text-yellow-500 mr-1" />
                      )}
                      {order.paymentDueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.paymentStatus === 'payé' ? 'bg-green-100 text-green-800' : 
                        order.paymentStatus === 'partiellement payé' ? 'bg-blue-100 text-blue-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => {
                        setCurrentOrder(order);
                        setShowOrderDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                  Aucune commande trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInvoicesList = () => (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold">Factures</h2>
        <button 
          onClick={() => setShowInvoiceModal(true)}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
          title="Importer une facture"
        >
          <FileUp size={20} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.length > 0 ? (
              invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.invoiceDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getOrderNumber(invoice.orderId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.amount.toFixed(2)} €</td>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${invoice.paymentStatus === 'payé' ? 'bg-green-100 text-green-800' : 
                        invoice.paymentStatus === 'en attente' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-orange-100 text-orange-800'}`}
                    >
                      {invoice.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Aucune facture trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrderDetails = () => {
    if (!currentOrder) return null;
    
    const supplier = suppliers.find(s => s.id === currentOrder.supplierId);
    const project = currentOrder.projectId ? projects.find(p => p.id === currentOrder.projectId) : null;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Numéro de commande</p>
            <p className="font-medium">{currentOrder.orderNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{currentOrder.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fournisseur</p>
            <p className="font-medium">{supplier?.name || 'Inconnu'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Statut</p>
            <p className="font-medium">{currentOrder.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Projet associé</p>
            <p className="font-medium">{project?.name || 'Non assigné'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date d'échéance de paiement</p>
            <p className={`font-medium ${
              currentOrder.paymentStatus !== 'payé' && isPaymentOverdue(currentOrder.paymentDueDate) 
                ? 'text-red-600' 
                : currentOrder.paymentStatus !== 'payé' && isPaymentDueSoon(currentOrder.paymentDueDate)
                ? 'text-yellow-600'
                : ''
            }`}>
              {currentOrder.paymentDueDate}
              {currentOrder.paymentStatus !== 'payé' && isPaymentOverdue(currentOrder.paymentDueDate) && (
                <span className="ml-2 text-red-600 text-sm">(En retard)</span>
              )}
              {currentOrder.paymentStatus !== 'payé' && isPaymentDueSoon(currentOrder.paymentDueDate) && !isPaymentOverdue(currentOrder.paymentDueDate) && (
                <span className="ml-2 text-yellow-600 text-sm">( Bientôt dû)</span>
              )}
            </p>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2">Détails financiers</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total HT</p>
              <p className="font-medium">{currentOrder.totalHT.toFixed(2)} €</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">TVA</p>
              <p className="font-medium">{currentOrder.tva.toFixed(2)} €</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Total TTC</p>
              <p className="font-medium text-lg">{currentOrder.totalTTC.toFixed(2)} €</p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2">Statut de paiement</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Statut actuel</p>
            <p className={`font-medium ${
              currentOrder.paymentStatus === 'payé' ? 'text-green-600' : 
              currentOrder.paymentStatus === 'partiellement payé' ? 'text-blue-600' : 
              'text-red-600'
            }`}>
              {currentOrder.paymentStatus}
            </p>
          </div>
          
          {currentOrder.paymentStatus !== 'payé' && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Mettre à jour le statut de paiement</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleUpdateOrderPaymentStatus(currentOrder.id || 0, 'payé')}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                >
                  Marquer comme payé
                </button>
                <button 
                  onClick={() => handleUpdateOrderPaymentStatus(currentOrder.id || 0, 'partiellement payé')}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                >
                  Partiellement payé
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
          <button 
            onClick={() => setShowOrderDetailsModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestion d'Entreprise 📊</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'orders' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            <div className="flex items-center space-x-2">
              <ShoppingCart size={18} />
              <span>Commandes</span>
            </div>
          </button>
          
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'projects' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            <div className="flex items-center space-x-2">
              <Briefcase size={18} />
              <span>Projets</span>
            </div>
          </button>
          
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'suppliers' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('suppliers')}
          >
            <div className="flex items-center space-x-2">
              <Users size={18} />
              <span>Fournisseurs</span>
            </div>
          </button>
          
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'invoices' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('invoices')}
          >
            <div className="flex items-center space-x-2">
              <FileText size={18} />
              <span>Factures</span>
            </div>
          </button>
        </div>
        
        {/* Content based on active tab */}
        <div className="space-y-6">
          {activeTab === 'suppliers' && renderSuppliersList()}
          {activeTab === 'orders' && renderOrdersList()}
          {activeTab === 'invoices' && renderInvoicesList()}
          {activeTab === 'projects' && renderProjectsList()}
        </div>
      </main>
      
      {/* Modals */}
      <Modal 
        isOpen={showSupplierModal} 
        onClose={() => setShowSupplierModal(false)}
        title={currentSupplier ? 'Modifier Fournisseur' : 'Ajouter Fournisseur'}
      >
        <SupplierForm 
          onSubmit={handleAddSupplier}
          onCancel={() => setShowSupplierModal(false)}
          initialData={currentSupplier || undefined}
        />
      </Modal>
      
      <Modal 
        isOpen={showProjectModal} 
        onClose={() => setShowProjectModal(false)}
        title={currentProject ? 'Modifier Projet' : 'Ajouter Projet'}
      >
        <ProjectForm 
          onSubmit={handleAddProject}
          onCancel={() => setShowProjectModal(false)}
          initialData={currentProject || undefined}
        />
      </Modal>
      
      <Modal 
        isOpen={showOrderModal} 
        onClose={() => setShowOrderModal(false)}
        title="Nouvelle Commande"
      >
        <OrderForm 
          onSubmit={handleAddOrder}
          onCancel={() => setShowOrderModal(false)}
          suppliers={suppliers}
          projects={projects}
        />
      </Modal>
      
      <Modal 
        isOpen={showInvoiceModal} 
        onClose={() => setShowInvoiceModal(false)}
        title="Importer une Facture"
      >
        <InvoiceUpload 
          onUpload={handleImportInvoice}
          onCancel={() => setShowInvoiceModal(false)}
        />
      </Modal>
      
      <Modal 
        isOpen={showOrderDetailsModal} 
        onClose={() => setShowOrderDetailsModal(false)}
        title="Détails de la Commande"
      >
        {renderOrderDetails()}
      </Modal>
    </div>
  );
}

export default App;