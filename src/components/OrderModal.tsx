import React from 'react';
import { Order, Supplier, Project } from '../types';
import { OrderForm } from './OrderForm';
import { X } from 'lucide-react';

type OrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order?: Order;
  suppliers: Supplier[];
  projects: Project[];
  onSubmit: (order: Order) => void;
  title?: string;
};

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  order,
  suppliers,
  projects,
  onSubmit,
  title,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (updatedOrder: Order) => {
    onSubmit(updatedOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div 
          className="inline-block align-bottom bg-white dark:bg-dark-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-headline"
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white dark:bg-transparent rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
            >
              <span className="sr-only">Fermer</span>
              <X size={24} />
            </button>
          </div>
          
          <div className="p-6">
            <OrderForm
              order={order}
              suppliers={suppliers}
              projects={projects}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};