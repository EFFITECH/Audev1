import React, { useState } from 'react';
import { Invoice, Order, Supplier } from '../types';
import { FileText, Calendar, DollarSign, FileUp, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

type InvoiceItemProps = {
  invoice: Invoice;
  order?: Order;
  supplier?: Supplier;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: number) => void;
  onView: (invoice: Invoice) => void;
};

export const InvoiceItem: React.FC<InvoiceItemProps> = ({
  invoice,
  order,
  supplier,
  onEdit,
  onDelete,
  onView,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    onEdit(invoice);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la facture ${invoice.invoiceNumber} ?`)) {
      onDelete(invoice.id || 0);
    }
    setShowMenu(false);
  };

  const handleView = () => {
    onView(invoice);
    setShowMenu(false);
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

  const getPaymentStatusClass = () => {
    if (invoice.paymentStatus === 'payé') {
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    } else if (isPaymentOverdue(invoice.paymentDueDate)) {
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    } else if (isPaymentDueSoon(invoice.paymentDueDate)) {
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden mb-4 border border-gray-200 dark:border-dark-border">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-3">
              <FileText size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium text-lg dark:text-dark-text">{invoice.invoiceNumber}</h3>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-0.5 text-xs rounded-full ${getPaymentStatusClass()}`}>
                  {invoice.paymentStatus}
                </span>
                {order && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-dark-muted">
                    Commande: {order.orderNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MoreVertical size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-md shadow-lg z-10 border border-gray-200 dark:border-dark-border">
                <div className="py-1">
                  <button
                    onClick={handleView}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Eye size={16} className="mr-2" />
                    Voir la facture
                  </button>
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Edit size={16} className="mr-2" />
                    Modifier
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="flex items-center text-sm">
            <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
            <span className="dark:text-dark-text">
              Date: {invoice.invoiceDate}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <DollarSign size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
            <span className="dark:text-dark-text">Montant: {invoice.amount.toFixed(2)} €</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
            <span className={`dark:text-dark-text ${
              isPaymentOverdue(invoice.paymentDueDate) && invoice.paymentStatus !== 'payé'
                ? 'text-red-600 dark:text-red-400'
                : isPaymentDueSoon(invoice.paymentDueDate) && invoice.paymentStatus !== 'payé'
                ? 'text-yellow-600 dark:text-yellow-400'
                : ''
            }`}>
              Échéance: {invoice.paymentDueDate}
              {isPaymentOverdue(invoice.paymentDueDate) && invoice.paymentStatus !== 'payé' && (
                <span className="ml-1 text-red-600 dark:text-red-400">(En retard)</span>
              )}
            </span>
          </div>
        </div>
        
        {supplier && (
          <div className="mt-2 text-sm text-gray-600 dark:text-dark-muted">
            Fournisseur: {supplier.name}
          </div>
        )}
        
        {invoice.fileUrl && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-border">
            <button
              onClick={handleView}
              className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <FileUp size={16} className="mr-1" />
              Voir le document
            </button>
          </div>
        )}
        
        {invoice.notes && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-border">
            <p className="text-sm text-gray-600 dark:text-dark-muted">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};