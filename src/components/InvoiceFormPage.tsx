import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Invoice, Order } from '../types';
import { InvoiceForm } from './InvoiceForm'; // Correction du chemin d'importation
import { getInvoiceById, addInvoice, updateInvoice, fetchOrders } from '../api';

type InvoiceFormPageProps = {
  onInvoiceAdded: () => void;
};

const InvoiceFormPage: React.FC<InvoiceFormPageProps> = ({ onInvoiceAdded }) => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch orders for the dropdown
      const ordersData = await fetchOrders();
      setOrders(ordersData);
      
      // If editing, fetch the invoice
      if (id) {
        try {
          const invoiceData = await getInvoiceById(parseInt(id, 10));
          setInvoice(invoiceData);
        } catch (fetchError) {
          console.error('Error fetching invoice:', fetchError);
          setError('Erreur lors du chargement de la facture');
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erreur lors du chargement des données');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = useCallback(async (invoiceData: Invoice) => {
    try {
      setLoading(true);
      setError(null);
      
      if (id) {
        await updateInvoice(parseInt(id, 10), invoiceData);
      } else {
        await addInvoice(invoiceData);
      }
      
      setLoading(false);
      onInvoiceAdded();
      navigate('/invoices', { replace: true });
    } catch (err) {
      console.error('Error saving invoice:', err);
      setError('Erreur lors de l\'enregistrement de la facture');
      setLoading(false);
    }
  }, [id, navigate, onInvoiceAdded]);

  const handleCancel = useCallback(() => {
    navigate('/invoices', { replace: true });
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}</span>
        <button 
          className="mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => fetchData()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card shadow-md rounded-lg p-6">
      <InvoiceForm
        invoice={invoice || undefined}
        orders={orders}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default InvoiceFormPage;