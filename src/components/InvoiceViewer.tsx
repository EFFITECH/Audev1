import React from 'react';
import { Invoice, Order } from '../types';
import { FileText, Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';

type InvoiceViewerProps = {
  invoice: Invoice;
  order?: Order;
  onClose: () => void;
  onUpdatePaymentStatus: (invoiceId: number, status: Invoice['paymentStatus']) => void;
};

export const InvoiceViewer: React.FC<InvoiceViewerProps> = ({
  invoice,
  order,
  onClose,
  onUpdatePaymentStatus,
}) => {
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
    if (invoice.paymentStatus === 'payé') {
      return <CheckCircle size={18} className="text-green-500" />;
    } else if (isPaymentOverdue(invoice.dueDate)) {
      return <AlertCircle size={18} className="text-red-500" />;
    } else if (isPaymentDueSoon(invoice.dueDate)) {
      return <Clock size={18} className="text-yellow-500" />;
    }
    return null;
  };
  
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-dark-border flex justify-between items-center">
        <div className="flex items-center">
          <FileText size={20} className="mr-2 text-gray-500 dark:text-gray-400" />
          <h2 className="text-xl font-semibold dark:text-dark-text">Facture {invoice.invoiceNumber}</h2>
        </div>
        <div className="flex items-center space-x-1">
          {getPaymentStatusIcon()}
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            invoice.paymentStatus === 'payé'
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : isPaymentOverdue(invoice.dueDate)
              ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              : isPaymentDueSoon(invoice.dueDate)
              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
              : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
          }`}>
            {invoice.paymentStatus}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-dark-muted mb-2">Informations de la facture</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-dark-muted">Numéro:</span>
                <span className="text-sm font-medium dark:text-dark-text">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-dark-muted">Date:</span>
                <span className="text-sm font-medium dark:text-dark-text">{invoice.invoiceDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-dark-muted">Commande associée:</span>
                <span className="text-sm font-medium dark:text-dark-text">
                  {order ? order.orderNumber : `Commande #${invoice.orderId}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-dark-muted">Conditions de paiement:</span>
                <span className="text-sm font-medium dark:text-dark-text">{invoice.paymentTerms}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-dark-muted mb-2">Informations financières</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-dark-muted">Montant:</span>
                <span className="text-sm font-medium dark:text-dark-text">{invoice.amount.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-dark-muted">Date d'échéance:</span>
                <span className={`text-sm font-medium ${
                  isPaymentOverdue(invoice.dueDate) && invoice.paymentStatus !== 'payé'
                    ? 'text-red-600 dark:text-red-400'
                    : isPaymentDueSoon(invoice.dueDate) && invoice.paymentStatus !== 'payé'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'dark:text-dark-text'
                }`}>
                  {invoice.dueDate}
                  {isPaymentOverdue(invoice.dueDate) && invoice.paymentStatus !== 'payé' && (
                    <span className="ml-2 text-red-600 dark:text-red-400 text-xs">(En retard)</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-dark-muted">Statut de paiement:</span>
                <span className={`text-sm font-medium ${
                  invoice.paymentStatus === 'payé' 
                    ? 'text-green-600 dark:text-green-400' 
                    : invoice.paymentStatus === 'partiellement payé' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {invoice.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* PDF Viewer */}
        {invoice.pdfUrl && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-dark-muted">Document</h3>
              <a 
                href={invoice.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <Download size={16} className="mr-1" />
                Télécharger
              </a>
            </div>
            <div className="border border-gray-200 dark:border-dark-border rounded-lg overflow-hidden">
              <iframe 
                src={invoice.pdfUrl} 
                className="w-full h-96" 
                title={`Facture ${invoice.invoiceNumber}`}
              />
            </div>
          </div>
        )}
        
        {/* Actions */}
        {invoice.paymentStatus !== 'payé' && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-border flex justify-end">
            <div className="space-x-2">
              <button
                onClick={() => onUpdatePaymentStatus(invoice.id || 0, 'payé')}
                className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-800"
              >
                Marquer comme payé
              </button>
              {invoice.paymentStatus !== 'partiellement payé' && (
                <button
                  onClick={() => onUpdatePaymentStatus(invoice.id || 0, 'partiellement payé')}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  Partiellement payé
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-dark-border flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};