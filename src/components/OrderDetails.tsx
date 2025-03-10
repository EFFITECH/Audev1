import React, { useState } from 'react';
import { FileText, Plus, Trash2, AlertCircle, Clock, CheckCircle, File } from 'lucide-react';
import Modal from './Modal';
import InvoiceForm from './InvoiceForm';
import PdfViewer from './PdfViewer';

type Order = {
  id: number;
  orderNumber: string;
  date: string;
  supplier: string;
  project?: string;
  status: string;
  totalTTC: number;
  paymentDueDate: string;
  paymentStatus: string;
};

type Invoice = {
  id: number;
  invoiceNumber: string;
  date: string;
  orderId: number;
  amount: number;
  dueDate: string;
  paymentStatus: string;
  pdfFile?: {
    name: string;
    url: string;
  };
};

type OrderDetailsProps = {
  order: Order;
  invoices: Invoice[];
  onClose: () => void;
  onAddInvoice: (invoice: any) => void;
  onDeleteInvoice: (invoiceId: number) => void;
  isPaymentDueSoon: (date: string) => boolean;
  isPaymentOverdue: (date: string) => boolean;
};

const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  invoices,
  onClose,
  onAddInvoice,
  onDeleteInvoice,
  isPaymentDueSoon,
  isPaymentOverdue
}) => {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  
  // Filtrer les factures associées à cette commande
  const orderInvoices = invoices.filter(invoice => invoice.orderId === order.id);
  
  // Calculer le total des factures
  const totalInvoiced = orderInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  
  // Calculer le reste à facturer
  const remainingToInvoice = Math.max(0, order.totalTTC - totalInvoiced);
  
  // Calculer le total payé (factures avec statut "payé")
  const totalPaid = orderInvoices
    .filter(invoice => invoice.paymentStatus === 'payé')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  
  // Calculer le reste à payer
  const remainingToPay = Math.max(0, order.totalTTC - totalPaid);

  const handleAddInvoice = (invoiceData: any) => {
    onAddInvoice(invoiceData);
    setIsInvoiceModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Détails de la commande</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Numéro de commande</p>
            <p className="font-medium text-gray-900 dark:text-white">{order.orderNumber}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
            <p className="font-medium text-gray-900 dark:text-white">{order.date}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fournisseur</p>
            <p className="font-medium text-gray-900 dark:text-white">{order.supplier}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Projet</p>
            <p className="font-medium text-gray-900 dark:text-white">{order.project || '-'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Statut</p>
            <p className="font-medium">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${order.status === 'reçue' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                  order.status === 'en attente' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 
                  order.status === 'envoyée' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 
                  'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'}`}
              >
                {order.status}
              </span>
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total TTC</p>
            <p className="font-medium text-gray-900 dark:text-white">{order.totalTTC.toFixed(2)} €</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Échéance de paiement</p>
            <div className="flex items-center">
              {order.paymentStatus !== 'payé' && isPaymentOverdue(order.paymentDueDate) && (
                <AlertCircle size={16} className="text-red-500 mr-1" />
              )}
              {order.paymentStatus !== 'payé' && isPaymentDueSoon(order.paymentDueDate) && !isPaymentOverdue(order.paymentDueDate) && (
                <Clock size={16} className="text-yellow-500 mr-1" />
              )}
              <p className="font-medium text-gray-900 dark:text-white">{order.paymentDueDate}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Statut de paiement</p>
            <p className="font-medium">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${order.paymentStatus === 'payé' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                  order.paymentStatus === 'partiellement payé' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 
                  'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}
              >
                {order.paymentStatus}
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Factures associées</h3>
          <button 
            onClick={() => setIsInvoiceModalOpen(true)}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Plus size={16} className="mr-1" />
            <span>Ajouter une facture</span>
          </button>
        </div>
        
        {orderInvoices.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">Aucune facture associée à cette commande.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Numéro</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Montant</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Échéance</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Document</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {orderInvoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{invoice.date}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{invoice.amount.toFixed(2)} €</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{invoice.dueDate}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${invoice.paymentStatus === 'payé' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                          invoice.paymentStatus === 'en attente' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 
                          'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'}`}
                      >
                        {invoice.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {invoice.pdfFile ? (
                        <PdfViewer 
                          fileName={invoice.pdfFile.name}
                          fileUrl={invoice.pdfFile.url}
                        />
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm italic">Aucun fichier</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      <button
                        onClick={() => onDeleteInvoice(invoice.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title="Supprimer cette facture"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">Facturation</p>
            <div className="flex justify-between mt-1">
              <p className="text-sm text-blue-600 dark:text-blue-300">Total facturé:</p>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{totalInvoiced.toFixed(2)} € / {order.totalTTC.toFixed(2)} €</p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-sm text-blue-600 dark:text-blue-300">Reste à facturer:</p>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{remainingToInvoice.toFixed(2)} €</p>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-200">Paiement</p>
            <div className="flex justify-between mt-1">
              <p className="text-sm text-green-600 dark:text-green-300">Total payé:</p>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">{totalPaid.toFixed(2)} € / {order.totalTTC.toFixed(2)} €</p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-sm text-green-600 dark:text-green-300">Reste à payer:</p>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">{remainingToPay.toFixed(2)} €</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Fermer
        </button>
      </div>
      
      {/* Modal pour ajouter une facture */}
      <Modal 
        isOpen={isInvoiceModalOpen} 
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Ajouter une facture"
      >
        <InvoiceForm 
          orders={[order]}
          onSubmit={handleAddInvoice}
          onCancel={() => setIsInvoiceModalOpen(false)}
          preSelectedOrderId={order.id}
        />
      </Modal>
    </div>
  );
};

export default OrderDetails;