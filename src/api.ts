import { Client, Supplier, Project, Order, Invoice, Quote } from './types';

// Fonction utilitaire pour simuler un délai de réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Stockage local simulé
let clients: Client[] = [];
let suppliers: Supplier[] = [];
let projects: Project[] = [];
let orders: Order[] = [];
let invoices: Invoice[] = [];

// Génération d'ID unique
const generateId = () => Math.random().toString(36).substring(2, 15);

// API pour les clients
export const fetchClients = async (): Promise<Client[]> => {
  await delay(500);
  // Ajout de données de test si aucun client n'existe
  if (clients.length === 0) {
    const now = new Date().toISOString();
    clients.push({
      id: generateId(),
      name: "Entreprise ABC",
      email: "contact@abc.com",
      phone: "01 23 45 67 89",
      address: "123 Rue Principale, 75001 Paris",
      createdAt: now,
      updatedAt: now
    });
  }
  return [...clients];
};

export const fetchClientById = async (id: string): Promise<Client | null> => {
  await delay(300);
  const client = clients.find(c => c.id === id);
  return client ? { ...client } : null;
};

export const createClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
  await delay(500);
  const now = new Date().toISOString();
  const newClient: Client = {
    id: generateId(),
    ...clientData,
    createdAt: now,
    updatedAt: now
  };
  
  clients.push(newClient);
  return { ...newClient };
};

export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client | null> => {
  await delay(500);
  const clientIndex = clients.findIndex(c => c.id === id);
  
  if (clientIndex === -1) return null;
  
  const now = new Date().toISOString();
  const updatedClient = {
    ...clients[clientIndex],
    ...clientData,
    updatedAt: now
  };
  
  clients[clientIndex] = updatedClient;
  return { ...updatedClient };
};

export const deleteClient = async (id: string): Promise<boolean> => {
  await delay(500);
  const initialLength = clients.length;
  clients = clients.filter(c => c.id !== id);
  return clients.length < initialLength;
};

// API pour les fournisseurs
export const fetchSuppliers = async (): Promise<Supplier[]> => {
  await delay(500);
  return [...suppliers];
};

export const fetchSupplierById = async (id: string): Promise<Supplier | null> => {
  await delay(300);
  const supplier = suppliers.find(s => s.id === id);
  return supplier ? { ...supplier } : null;
};

export const createSupplier = async (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> => {
  await delay(500);
  const now = new Date().toISOString();
  const newSupplier: Supplier = {
    id: generateId(),
    ...supplierData,
    createdAt: now,
    updatedAt: now
  };
  
  suppliers.push(newSupplier);
  return { ...newSupplier };
};

export const updateSupplier = async (id: string, supplierData: Partial<Supplier>): Promise<Supplier | null> => {
  await delay(500);
  const supplierIndex = suppliers.findIndex(s => s.id === id);
  
  if (supplierIndex === -1) return null;
  
  const updatedSupplier = {
    ...suppliers[supplierIndex],
    ...supplierData,
    updatedAt: new Date().toISOString()
  };
  
  suppliers[supplierIndex] = updatedSupplier;
  return { ...updatedSupplier };
};

export const deleteSupplier = async (id: string): Promise<boolean> => {
  await delay(500);
  const initialLength = suppliers.length;
  suppliers = suppliers.filter(s => s.id !== id);
  return suppliers.length < initialLength;
};

// API simplifiées pour les projets
export const fetchProjects = async (): Promise<Project[]> => {
  await delay(500);
  return [...projects];
};

export const fetchProjectById = async (id: string): Promise<Project | null> => {
  await delay(300);
  const project = projects.find(p => p.id === id);
  return project ? { ...project } : null;
};

export const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
  await delay(500);
  const now = new Date().toISOString();
  const newProject: Project = {
    id: generateId(),
    ...projectData,
    createdAt: now,
    updatedAt: now
  };
  
  projects.push(newProject);
  return { ...newProject };
};

export const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project | null> => {
  await delay(500);
  const projectIndex = projects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) return null;
  
  const updatedProject = {
    ...projects[projectIndex],
    ...projectData,
    updatedAt: new Date().toISOString()
  };
  
  projects[projectIndex] = updatedProject;
  return { ...updatedProject };
};

export const deleteProject = async (id: string): Promise<boolean> => {
  await delay(500);
  const initialLength = projects.length;
  projects = projects.filter(p => p.id !== id);
  return projects.length < initialLength;
};

// API simplifiées pour les commandes
export const fetchOrders = async (): Promise<Order[]> => {
  await delay(500);
  return [...orders];
};

export const fetchOrderById = async (id: string): Promise<Order | null> => {
  await delay(300);
  const order = orders.find(o => o.id === id);
  return order ? { ...order } : null;
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
  await delay(500);
  const now = new Date().toISOString();
  const newOrder: Order = {
    id: generateId(),
    ...orderData,
    createdAt: now,
    updatedAt: now
  };
  
  orders.push(newOrder);
  return { ...newOrder };
};

export const updateOrder = async (id: string, orderData: Partial<Order>): Promise<Order | null> => {
  await delay(500);
  const orderIndex = orders.findIndex(o => o.id === id);
  
  if (orderIndex === -1) return null;
  
  const updatedOrder = {
    ...orders[orderIndex],
    ...orderData,
    updatedAt: new Date().toISOString()
  };
  
  orders[orderIndex] = updatedOrder;
  return { ...updatedOrder };
};

export const deleteOrder = async (id: string): Promise<boolean> => {
  await delay(500);
  const initialLength = orders.length;
  orders = orders.filter(o => o.id !== id);
  return orders.length < initialLength;
};

// API simplifiées pour les factures
export const fetchInvoices = async (): Promise<Invoice[]> => {
  await delay(500);
  return [...invoices];
};

export const fetchInvoiceById = async (id: string): Promise<Invoice | null> => {
  await delay(300);
  const invoice = invoices.find(i => i.id === id);
  return invoice ? { ...invoice } : null;
};

export const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> => {
  await delay(500);
  const now = new Date().toISOString();
  const newInvoice: Invoice = {
    id: generateId(),
    ...invoiceData,
    createdAt: now,
    updatedAt: now
  };
  
  invoices.push(newInvoice);
  return { ...newInvoice };
};

export const updateInvoice = async (id: string, invoiceData: Partial<Invoice>): Promise<Invoice | null> => {
  await delay(500);
  const invoiceIndex = invoices.findIndex(i => i.id === id);
  
  if (invoiceIndex === -1) return null;
  
  const updatedInvoice = {
    ...invoices[invoiceIndex],
    ...invoiceData,
    updatedAt: new Date().toISOString()
  };
  
  invoices[invoiceIndex] = updatedInvoice;
  return { ...updatedInvoice };
};

export const deleteInvoice = async (id: string): Promise<boolean> => {
  await delay(500);
  const initialLength = invoices.length;
  invoices = invoices.filter(i => i.id !== id);
  return invoices.length < initialLength;
};