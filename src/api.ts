import { Supplier, Order, Invoice, Project } from './types';

// Mock data for suppliers
const mockSuppliers: Supplier[] = [
  { id: 1, name: 'Fournisseur A', contact: 'contact@fournisseura.com', bankInfo: 'FR76 1234 5678', category: 'Matériel' },
  { id: 2, name: 'Fournisseur B', contact: 'contact@fournisseurb.com', bankInfo: 'FR76 8765 4321', category: 'Services' },
];

// Mock data for projects
const mockProjects: Project[] = [
  { 
    id: 1, 
    name: 'Rénovation Bureaux', 
    description: 'Rénovation complète des bureaux du siège', 
    startDate: '2025-01-01', 
    status: 'en cours' 
  },
  { 
    id: 2, 
    name: 'Développement Site Web', 
    description: 'Création du nouveau site web corporate', 
    startDate: '2025-02-15', 
    endDate: '2025-05-30', 
    status: 'en cours' 
  },
];

// Mock data for orders
const mockOrders: Order[] = [
  { 
    id: 1, 
    orderNumber: 'CMD-001', 
    date: '2025-01-15', 
    supplierId: 1, 
    projectId: 1,
    status: 'reçue', 
    totalHT: 1000, 
    tva: 200, 
    totalTTC: 1200,
    paymentDueDate: '2025-02-15',
    paymentStatus: 'non payé'
  },
  { 
    id: 2, 
    orderNumber: 'CMD-002', 
    date: '2025-02-20', 
    supplierId: 2, 
    projectId: 2,
    status: 'en attente', 
    totalHT: 500, 
    tva: 100, 
    totalTTC: 600,
    paymentDueDate: '2025-03-20',
    paymentStatus: 'non payé'
  },
];

// Mock data for invoices
const mockInvoices: Invoice[] = [
  { 
    id: 1, 
    invoiceNumber: 'FACT-001', 
    invoiceDate: '2025-01-20', 
    orderId: 1, 
    amount: 1200, 
    paymentTerms: '30 jours', 
    dueDate: '2025-02-20', 
    paymentStatus: 'en attente' 
  },
];

// Mock API functions
export const fetchSuppliers = (): Promise<Supplier[]> => {
  return Promise.resolve([...mockSuppliers]);
};

export const addSupplier = (supplier: Partial<Supplier>): Promise<Supplier> => {
  const newSupplier: Supplier = {
    id: mockSuppliers.length + 1,
    name: supplier.name || '',
    contact: supplier.contact || '',
    bankInfo: supplier.bankInfo || '',
    category: supplier.category || ''
  };
  
  mockSuppliers.push(newSupplier);
  return Promise.resolve(newSupplier);
};

export const fetchProjects = (): Promise<Project[]> => {
  return Promise.resolve([...mockProjects]);
};

export const addProject = (project: Partial<Project>): Promise<Project> => {
  const newProject: Project = {
    id: mockProjects.length + 1,
    name: project.name || '',
    description: project.description || '',
    startDate: project.startDate || new Date().toISOString().split('T')[0],
    endDate: project.endDate,
    status: project.status || 'en cours'
  };
  
  mockProjects.push(newProject);
  return Promise.resolve(newProject);
};

export const fetchOrders = (): Promise<Order[]> => {
  return Promise.resolve([...mockOrders]);
};

export const addOrder = (order: Partial<Order>): Promise<Order> => {
  const newOrder: Order = {
    id: mockOrders.length + 1,
    orderNumber: order.orderNumber || '',
    date: order.date || new Date().toISOString().split('T')[0],
    supplierId: order.supplierId || 0,
    projectId: order.projectId,
    status: order.status || 'en attente',
    totalHT: order.totalHT || 0,
    tva: order.tva || 0,
    totalTTC: order.totalTTC || 0,
    paymentDueDate: order.paymentDueDate || '',
    paymentStatus: order.paymentStatus || 'non payé'
  };
  
  mockOrders.push(newOrder);
  return Promise.resolve(newOrder);
};

export const updateOrderPaymentStatus = (orderId: number, paymentStatus: Order['paymentStatus']): Promise<Order> => {
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return Promise.reject(new Error('Commande non trouvée'));
  }
  
  mockOrders[orderIndex].paymentStatus = paymentStatus;
  return Promise.resolve(mockOrders[orderIndex]);
};

export const fetchInvoices = (): Promise<Invoice[]> => {
  return Promise.resolve([...mockInvoices]);
};

export const addInvoice = (invoice: Partial<Invoice>): Promise<Invoice> => {
  const newInvoice: Invoice = {
    id: mockInvoices.length + 1,
    invoiceNumber: invoice.invoiceNumber || `INV-${Date.now()}`,
    invoiceDate: invoice.invoiceDate || new Date().toISOString().split('T')[0],
    orderId: invoice.orderId || 0,
    amount: invoice.amount || 0,
    paymentTerms: invoice.paymentTerms || '30 jours',
    dueDate: invoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentStatus: invoice.paymentStatus || 'en attente',
    pdfUrl: invoice.pdfUrl
  };
  
  mockInvoices.push(newInvoice);
  return Promise.resolve(newInvoice);
};

export const importInvoicePDF = (file: File): Promise<{ success: boolean, pdfUrl: string }> => {
  // In a real application, this would upload the file to a server
  // For this mock, we'll just pretend it worked
  const pdfUrl = URL.createObjectURL(file);
  
  const newInvoice: Partial<Invoice> = {
    invoiceNumber: `INV-${Date.now()}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    orderId: 1, // Assigning to the first order by default
    amount: 1200, // Default amount based on the first order
    paymentTerms: '30 jours',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentStatus: 'en attente',
    pdfUrl: pdfUrl
  };
  
  addInvoice(newInvoice);
  
  return Promise.resolve({ success: true, pdfUrl });
};