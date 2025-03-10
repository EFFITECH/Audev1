// Types pour les entités principales
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  clientId: string;
  projectId: string;
  orderNumber: string;
  orderDate: string;
  deliveryDate: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalHT: number;
}

export interface Quote {
  id?: number;
  quoteNumber: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  quoteDate: string;
  validUntil: string;
  status: 'brouillon' | 'envoyé' | 'accepté' | 'refusé' | 'expiré';
  description: string;
  items: QuoteItem[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  convertedToOrderId?: string;
  createdAt?: string;
  updatedAt?: string;
}