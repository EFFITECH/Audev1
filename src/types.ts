export type Supplier = {
  id?: number;
  name: string;
  contact: string;
  bankInfo: string;
  category: string;
};

export type Project = {
  id?: number;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'en cours' | 'terminé' | 'en pause' | 'annulé';
};

export type Order = {
  id?: number;
  orderNumber: string;
  date: string;
  supplierId: number;
  projectId?: number;
  status: 'en attente' | 'envoyée' | 'reçue' | 'partiellement reçue';
  totalHT: number;
  tva: number;
  totalTTC: number;
  paymentDueDate: string;
  paymentStatus: 'non payé' | 'payé' | 'partiellement payé';
};

export type Invoice = {
  id?: number;
  invoiceNumber: string;
  invoiceDate: string;
  orderId: number;
  amount: number;
  paymentTerms: string;
  dueDate: string;
  paymentStatus: 'en attente' | 'payé' | 'partiellement payé';
  pdfUrl?: string;
};