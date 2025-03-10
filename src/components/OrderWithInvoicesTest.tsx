ok import React from 'react';
import { OrderWithInvoices } from './OrderWithInvoices';
import { Order, Invoice, Supplier, Project } from '../types';

// Données de test
const mockOrder: Order = {
  id: 1,
  orderNumber: 'CMD-2023-001',
  date: '2023-05-15',
  supplierId: 1,
  projectId: 1,
  status: 'confirmée',
  totalHT: 1000,
  tva: 200,
  totalTTC: 1200,
  paymentStatus: 'non payé',
  paymentDueDate: '2023-06-15',
  notes: 'Commande test'
};

const mockInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: 'FACT-2023-001',
    invoiceDate: '2023-05-20',
    orderId: 1,
    amount: 600,
    paymentStatus: 'payé',
    paymentDueDate: '2023-06-20',
    notes: '',
    fileUrl: '/invoices/invoice1.pdf'
  }
];

const mockSupplier: Supplier = {
  id: 1,
  name: 'Fournisseur Test',
  contactName: 'Contact Test',
  email: 'contact@test.com',
  phone: '0123456789',
  address: '123 Rue Test',
  city: 'Ville Test',
  postalCode: '75000',
  country: 'France',
  notes: ''
};

const mockProject: Project = {
  id: 1,
  name: 'Projet Test',
  description: 'Description du projet test',
  clientId: 1,
  status: 'en cours',
  startDate: '2023-01-01',
  endDate: '2023-12-31',
  budget: 5000,
  notes: ''
};

export const OrderWithInvoicesTest: React.FC = () => {
  const handleUpdatePaymentStatus = (orderId: number, status: Order['paymentStatus']) => {
    console.log(`Mise à jour du statut de paiement pour la commande ${orderId}: ${status}`);
  };

  const handleAddInvoice = (orderId: number) => {
    console.log(`Ajout d'une facture pour la commande ${orderId}`);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    console.log(`Affichage de la facture ${invoice.invoiceNumber}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test du composant OrderWithInvoices</h1>
      
      <OrderWithInvoices
        order={mockOrder}
        invoices={mockInvoices}
        supplier={mockSupplier}
        project={mockProject}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        onAddInvoice={handleAddInvoice}
        onViewInvoice={handleViewInvoice}
      />
    </div>
  );
};

export default OrderWithInvoicesTest;