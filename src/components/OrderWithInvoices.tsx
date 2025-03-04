import React, { useState } from 'react';
import { Order, Invoice, Supplier, Project } from '../types';
import { FileText, ChevronDown, ChevronUp, AlertCircle, Clock, CheckCircle, FileUp } from 'lucide-react';

type OrderWithInvoicesProps = {
  order: Order;
  invoices: Invoice[];
  supplier: Supplier | undefined;
  project: Project | undefined;
  onUpdatePaymentStatus: (orderId: number, status: Order['paymentStatus']) => void;
  onAddInvoice: (orderId: number) => void;
  onViewInvoice: (invoice: Invoice) => void;
};

export const OrderWithInvoices: React.FC<OrderWithInvoicesProps> = ({
  order,
  invoices,
  supplier,
  project,
  onUpdatePaymentStatus,
  onAddInvoice,
  onViewInvoice,
}) => {
  const [expanded, setExpanded] = useState(false);
  
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
  
  const getPaymentStatusIcon = () => {
    if (order.paymentStatus === 'payé') {
      return <CheckCircle size={18} className="text-green-500" />;
    } else if (isPaymentOverdue(order.paymentDueDate)) {
      return <AlertCircle size={18} className="text-red-500" />;
    } else if (isPaymentDueSoon(order.paymentDueDate)) {
      return <Clock size={18} className="text-yellow-500" />;
    }
    return null;
  };
  
  const getPaymentStatusClass = () => {
    if (order.paymentStatus === 'payé') {
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    } else if (order.paymentStatus === 'partiellement payé') {
      return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
    } else if (isPaymentOverdue(order.paymentDueDate)) {
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    } else if (isPaymentDueSoon(order.paymentDueDate)) {
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
  };
  
  const totalInvoiceAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const remainingAmount = order.totalTTC - totalInvoiceAmount;
  
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden mb-4 border border-gray-200 dark:border-dark-border">
      {/* Order header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {expanded ? <ChevronUp size={20} className="dark:text-dark-text" /> : <ChevronDown size={20} className="dark:text-dark-text" />}
          </div>
          <div>
            <h3 className="font-medium dark:text-dark-text">Commande {order.orderNumber}</h3>
            <p className="text-sm text-gray-500 dark:text-dark-muted">
              {supplier?.name || 'Fournisseur inconnu'} • {order.date}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-medium dark:text-dark-text">{order.totalTTC.toFixed(2)} €</p>
            <div className="flex items-center justify-end">
              <span className={`px-2 py-0.5 text-xs rounded-full ${getPaymentStatusClass()}`}>
                {order.paymentStatus}
              </span>
              {getPaymentStatusIcon()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-200 dark:border-dark-border p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-dark-muted mb-1">Détails de la commande</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-dark-muted">Numéro:</span>
                  <span className="text-sm font-medium dark:text-dark-text">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-dark-muted">Date:</span>
                  <span className="text-sm font-medium dark:text-dark-text">{order.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-dark-muted">Fournisseur:</span>
                  <span className="text-sm font-medium dark:text-dark-text">{supplier?.name || 'Inconnu'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-dark-muted">Projet:</span>
                  <span className="text-sm font-medium dark:text-dark-text">{project?.name || 'Non assigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-dark-muted">Statut:</span>
                  <span className="text-sm font-medium dark:text-dark-text">{order.status}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-dark-muted mb-1">Informations financières</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-dark-muted">Total HT:</span>
                  <span className="text-sm font-medium dark:text-dark-text">{order.totalHT.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-dark-muted">TVA:</span>
                  <span className="text-sm font-medium dark:text-dark-text">{order.tva.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-dark-muted">Total TTC:</span>
                  <span className="text-sm font-medium dark:text-dark-text">{order.totalTTC.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-dark-muted">Échéance:</span>
                  <span className={`text-sm font-medium ${
                    isPaymentOverdue(order.paymentDueDate) && order.paymentStatus !== 'payé'
                      ? 'text-red-600 dark:text-red-400'
                      : isPaymentDueSoon(order.paymentDueDate) && order.paymentStatus !== 'payé'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'dark:text-dark-text'
                  }`}>
                    {order.paymentDueDate}
                    {isPaymentOverdue(order.paymentDueDate) && order.paymentStatus !== 'payé' && (
                      <span className="ml-2 text-red-600 dark:text-red-400 text-xs">(En retard)</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-dark-muted">Statut de paiement:</span>
                  <span className={`text-sm font-medium ${
                    order.paymentStatus === 'payé' 
                      ? 'text-green-600 dark:text-green-400' 
                      : order.paymentStatus === 'partiellement payé' 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Factures associées */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium dark:text-dark-text">Factures associées</h4>
              <button
                onClick={() => onAddInvoice(order.id || 0)}
                className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <FileUp size={16} className="mr-1" />
                Ajouter une facture
              </button>
            </div>
            
            {invoices.length > 0 ? (
              <div className="space-y-2">
                {invoices.map(invoice => (
                  <div 
                    key={invoice.id} 
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => onViewInvoice(invoice)}
                  >
                    <div className="flex items-center">
                      <FileText size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium dark:text-dark-text">{invoice.invoiceNumber}</p>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">{invoice.invoiceDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium dark:text-dark-text">{invoice.amount.toFixed(2)} €</p>
                      <p className={`text-xs ${
                        invoice.paymentStatus === 'payé' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {invoice.paymentStatus}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded mt-2">
                  <div>
                    <p className="text-sm font-medium dark:text-dark-text">Total facturé</p>
                    {remainingAmount > 0 && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Reste à facturer: {remainingAmount.toFixed(2)} €
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-medium dark:text-dark-text">{totalInvoiceAmount.toFixed(2)} €</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-dark-muted italic">Aucune facture associée à cette commande</p>
            )}
          </div>
          
          {/* Actions */}
          {order.paymentStatus !== 'payé' && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border flex justify-end">
              <div className="space-x-2">
                <button
                  onClick={() => onUpdatePaymentStatus(order.id || 0, 'payé')}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-800"
                >
                  Marquer comme payé
                </button>
                {order.paymentStatus !== 'partiellement payé' && (
                  <button
                    onClick={() => onUpdatePaymentStatus(order.id || 0, 'partiellement payé')}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                  >
                    Partiellement payé
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};