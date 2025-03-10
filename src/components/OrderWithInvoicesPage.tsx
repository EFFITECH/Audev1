import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order, Invoice, Supplier, Project } from '../types';
import { OrderWithInvoices } from './OrderWithInvoices';
import { InvoiceModal } from './InvoiceModalUpdated';
import { getOrderById, fetchInvoicesByOrderId, updateOrderPaymentStatus, getSupplierById, getProjectById } from '../api';

const OrderWithInvoicesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate('/orders');
        return;
      }

      try {
        setLoading(true);
        const orderId = parseInt(id, 10);
        
        // Fetch order details
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
        
        // Fetch invoices for this order
        const invoicesData = await fetchInvoicesByOrderId(orderId);
        setInvoices(invoicesData);
        
        // Fetch supplier details if supplierId exists
        if (orderData && 'supplierId' in orderData && orderData.supplierId) {
          try {
            const supplierData = await getSupplierById(orderData.supplierId);
            setSupplier(supplierData);
          } catch (err) {
            console.error('Error fetching supplier:', err);
          }
        }
        
        // Fetch project details if projectId exists
        if (orderData && 'projectId' in orderData && orderData.projectId) {
          try {
            const projectData = await getProjectById(orderData.projectId);
            setProject(projectData);
          } catch (err) {
            console.error('Error fetching project:', err);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order data:', err);
        setError('Erreur lors du chargement des données de la commande');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleUpdatePaymentStatus = async (orderId: number, status: Order['paymentStatus']) => {
    try {
      const updatedOrder = await updateOrderPaymentStatus(orderId, status);
      setOrder(updatedOrder);
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Erreur lors de la mise à jour du statut de paiement');
    }
  };

  const handleAddInvoice = (orderId: number) => {
    setSelectedInvoice(null);
    setIsInvoiceModalOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleInvoiceSubmit = async (invoice: Invoice) => {
    try {
      // Refresh invoices after adding/updating
      const invoicesData = await fetchInvoicesByOrderId(parseInt(id!, 10));
      setInvoices(invoicesData);
    } catch (err) {
      console.error('Error refreshing invoices:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error || 'Commande non trouvée'}</span>
        <button 
          onClick={() => navigate('/orders')}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Retour aux commandes
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-dark-text">Détails de la commande</h2>
        <button 
          onClick={() => navigate('/orders')}
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded"
        >
          Retour aux commandes
        </button>
      </div>
      
      <OrderWithInvoices
        order={order}
        invoices={invoices}
        supplier={supplier || undefined}
        project={project || undefined}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        onAddInvoice={handleAddInvoice}
        onViewInvoice={handleViewInvoice}
      />
      
      {isInvoiceModalOpen && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          invoice={selectedInvoice || undefined}
          order={order}
          onSubmit={handleInvoiceSubmit}
          title={selectedInvoice ? 'Modifier la facture' : 'Ajouter une facture'}
        />
      )}
    </div>
  );
};

export default OrderWithInvoicesPage;