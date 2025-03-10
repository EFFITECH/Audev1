import React from 'react';
import { FileText, Download, AlertCircle, Clock, CheckCircle } from 'lucide-react';

type Invoice = {
  id: number;
  invoiceNumber: string;
  date: string;
  orderId: number;
  amount: number;
  dueDate: string;
  paymentStatus: 'en attente' | 'payé' | 'partiellement payé';
};

type Order = {
  id: number;
  orderNumber: string;
};

type InvoiceDetailsProps = {
  invoice: Invoice;
  order?: Order;
  onUpdatePaymentStatus: (status: 'en attente' | 'payé' | 'partiellement payé') => void;
};

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  invoice,
  order,
  onUpdatePaymentStatus
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-blue-500 mr-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Facture {invoice.invoiceNumber}</h2>
        </div>
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${invoice.paymentStatus === 'payé' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
            invoice.paymentStatus === 'en attente' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 
            'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'}`}
        >
          {invoice.paymentStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Détails de la facture</h3>
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-md">
            <dl>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b dark:border-gray-700">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Numéro</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{invoice.invoiceNumber}</dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b dark:border-gray-700">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{invoice.date}</dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b dark:border-gray-700">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Commande associée</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {order ? order.orderNumber : `Commande #${invoice.orderId}`}
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b dark:border-gray-700">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Montant</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{invoice.amount.toFixed(2)} €</dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b dark:border-gray-700">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Échéance</dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2 flex items-center">
                  {invoice.paymentStatus !== 'payé' && isPaymentOverdue(invoice.dueDate) && (
                    <AlertCircle size={16} className="text-red-500 mr-1" />
                  )}
                  {invoice.paymentStatus !== 'payé' && isPaymentDueSoon(invoice.dueDate) && !isPaymentOverdue(invoice.dueDate) && (
                    <Clock size={16} className="text-yellow-500 mr-1" />
                  )}
                  <span className={`${
                    invoice.paymentStatus !== 'payé' && isPaymentOverdue(invoice.dueDate)
                      ? 'text-red-600 dark:text-red-400'
                      : invoice.paymentStatus !== 'payé' && isPaymentDueSoon(invoice.dueDate)
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {invoice.dueDate}
                    {invoice.paymentStatus !== 'payé' && isPaymentOverdue(invoice.dueDate) && (
                      <span className="ml-2 text-xs">(En retard)</span>
                    )}
                  </span>
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Statut de paiement</dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${invoice.paymentStatus === 'payé' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                      invoice.paymentStatus === 'partiellement payé' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 
                      'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}`}
                  >
                    {invoice.paymentStatus}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Document</h3>
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-md p-6 flex flex-col items-center justify-center h-64">
            <FileText className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Aperçu du document non disponible</p>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download size={16} className="mr-1" />
              Télécharger la facture
            </button>
          </div>
        </div>
      </div>

      {invoice.paymentStatus !== 'payé' && (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-md p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Mettre à jour le statut de paiement</h3>
          <div className="flex space-x-3">
            <button
              onClick={() => onUpdatePaymentStatus('payé')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckCircle size={16} className="mr-1" />
              Marquer comme payé
            </button>
            {invoice.paymentStatus !== 'partiellement payé' && (
              <button
                onClick={() => onUpdatePaymentStatus('partiellement payé')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Partiellement payé
              </button>
            )}
            {invoice.paymentStatus !== 'en attente' && (
              <button
                onClick={() => onUpdatePaymentStatus('en attente')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                En attente
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;