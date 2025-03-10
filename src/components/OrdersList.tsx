import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types';
import { deleteOrder } from '../api';
import { ShoppingCart, Calendar, DollarSign, Edit, Trash2, FileText } from 'lucide-react';

type OrdersListProps = {
  orders: Order[];
  onOrderDeleted: () => void;
};

export const OrdersList: React.FC<OrdersListProps> = ({ orders, onOrderDeleted }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      try {
        await deleteOrder(id);
        onOrderDeleted();
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Une erreur est survenue lors de la suppression de la commande.');
      }
    }
  };

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.projectName && order.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    order.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'envoyée':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'reçue':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'partiellement reçue':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'payé':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'partiellement payé':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'non payé':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
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
        <h2 className="text-2xl font-bold dark:text-dark-text">Liste des commandes</h2>
        <Link to="/orders/new" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Ajouter une commande
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher une commande..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 dark:text-dark-muted">Aucune commande trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4 border border-gray-200 dark:border-dark-border">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <ShoppingCart size={20} className="text-blue-500 mr-2" />
                  <div>
                    <h3 className="text-lg font-semibold dark:text-dark-text">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500 dark:text-dark-muted">
                      Client: {order.clientName}
                      {order.projectName && ` • Projet: ${order.projectName}`}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link to={`/orders/edit/${order.id}`} className="text-blue-500 hover:text-blue-700">
                    <Edit size={18} />
                  </Link>
                  <button 
                    onClick={() => order.id && handleDelete(order.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              
              {order.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-dark-muted">{order.description}</p>
              )}
              
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-dark-muted">
                  <Calendar size={16} className="mr-2" />
                  <span>Date: {new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-dark-muted">
                  <DollarSign size={16} className="mr-2" />
                  <span>Montant: {order.totalAmount.toFixed(2)} €</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-dark-muted">
                  <Calendar size={16} className="mr-2" />
                  <span className={`${
                    isPaymentOverdue(order.paymentDueDate) && order.paymentStatus !== 'payé'
                      ? 'text-red-600 dark:text-red-400'
                      : isPaymentDueSoon(order.paymentDueDate) && order.paymentStatus !== 'payé'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : ''
                  }`}>
                    Échéance: {new Date(order.paymentDueDate).toLocaleDateString()}
                    {isPaymentOverdue(order.paymentDueDate) && order.paymentStatus !== 'payé' && (
                      <span className="ml-1 text-red-600 dark:text-red-400">(En retard)</span>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-border flex justify-end">
                <Link 
                  to={`/orders/with-invoices/${order.id}`} 
                  className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <FileText size={16} className="mr-1" />
                  Voir les factures
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;