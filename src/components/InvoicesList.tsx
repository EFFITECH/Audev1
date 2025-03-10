import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Invoice } from '../types';
import { deleteInvoice } from '../api';
import { FileText, Calendar, DollarSign, Edit, Trash2, Eye } from 'lucide-react';

type InvoicesListProps = {
  invoices: Invoice[];
  onInvoiceDeleted: () => void;
};

export const InvoicesList: React.FC<InvoicesListProps> = ({ invoices, onInvoiceDeleted }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      try {
        await deleteInvoice(id);
        onInvoiceDeleted();
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Une erreur est survenue lors de la suppression de la facture.');
      }
    }
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusText = (status: Invoice['status']) => {
    switch (status) {
      case 'PAID':
        return 'Payée';
      case 'PENDING':
        return 'En attente';
      case 'OVERDUE':
        return 'En retard';
      default:
        return status;
    }
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-dark-text">Liste des factures</h2>
        <Link to="/invoices/new" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Ajouter une facture
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher une facture..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredInvoices.length === 0 ? (
        <p className="text-gray-500 dark:text-dark-muted">Aucune facture trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInvoices.map(invoice => (
            <div key={invoice.id} className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4 border border-gray-200 dark:border-dark-border">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <FileText size={20} className="text-purple-500 mr-2" />
                  <div>
                    <h3 className="text-lg font-semibold dark:text-dark-text">{invoice.invoiceNumber}</h3>
                    <p className="text-sm text-gray-500 dark:text-dark-muted">
                      Client: {invoice.clientName} • Commande: {invoice.orderNumber}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {invoice.pdfUrl && (
                    <a 
                      href={invoice.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Eye size={18} />
                    </a>
                  )}
                  <Link to={`/invoices/edit/${invoice.id}`} className="text-blue-500 hover:text-blue-700">
                    <Edit size={18} />
                  </Link>
                  <button 
                    onClick={() => invoice.id && handleDelete(invoice.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                  {getStatusText(invoice.status)}
                </span>
              </div>
              
              {invoice.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-dark-muted">{invoice.description}</p>
              )}
              
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-dark-muted">
                  <Calendar size={16} className="mr-2" />
                  <span>Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-dark-muted">
                  <DollarSign size={16} className="mr-2" />
                  <span>Montant: {invoice.totalAmount.toFixed(2)} €</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-dark-muted">
                  <Calendar size={16} className="mr-2" />
                  <span className={`${
                    isPaymentOverdue(invoice.dueDate) && invoice.status !== 'PAID'
                      ? 'text-red-600 dark:text-red-400'
                      : isPaymentDueSoon(invoice.dueDate) && invoice.status !== 'PAID'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : ''
                  }`}>
                    Échéance: {new Date(invoice.dueDate).toLocaleDateString()}
                    {isPaymentOverdue(invoice.dueDate) && invoice.status !== 'PAID' && (
                      <span className="ml-1 text-red-600 dark:text-red-400">(En retard)</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoicesList;