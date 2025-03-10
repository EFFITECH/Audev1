import { supabase } from '../lib/supabase';
import { Invoice } from '../types';

// Données fictives pour le développement
const mockInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: 'FACT-2023-001',
    invoiceDate: '2023-01-25',
    orderId: 1,
    orderNumber: 'CMD-2023-001',
    clientId: 1,
    clientName: 'Entreprise ABC',
    description: 'Facture pour la refonte du site web',
    totalAmount: 15000,
    paymentTerms: '30 jours',
    dueDate: '2023-02-25',
    status: 'PAID',
    pdfUrl: 'https://example.com/invoices/invoice-001.pdf'
  },
  {
    id: 2,
    invoiceNumber: 'FACT-2023-002',
    invoiceDate: '2023-03-20',
    orderId: 2,
    orderNumber: 'CMD-2023-002',
    clientId: 2,
    clientName: 'Société XYZ',
    description: 'Facture pour le développement de l\'application mobile - Phase 1',
    totalAmount: 12500,
    paymentTerms: '30 jours',
    dueDate: '2023-04-20',
    status: 'PENDING',
    pdfUrl: 'https://example.com/invoices/invoice-002.pdf'
  },
  {
    id: 3,
    invoiceNumber: 'FACT-2023-003',
    invoiceDate: '2023-03-25',
    orderId: 2,
    orderNumber: 'CMD-2023-002',
    clientId: 2,
    clientName: 'Société XYZ',
    description: 'Facture pour le développement de l\'application mobile - Phase 2',
    totalAmount: 12500,
    paymentTerms: '30 jours',
    dueDate: '2023-04-25',
    status: 'PENDING',
    pdfUrl: 'https://example.com/invoices/invoice-003.pdf'
  },
  {
    id: 4,
    invoiceNumber: 'FACT-2023-004',
    invoiceDate: '2023-03-05',
    orderId: 3,
    orderNumber: 'CMD-2023-003',
    clientId: 3,
    clientName: 'Groupe 123',
    description: 'Facture pour la migration cloud - Acompte',
    totalAmount: 9250,
    paymentTerms: '15 jours',
    dueDate: '2023-03-20',
    status: 'PAID',
    pdfUrl: 'https://example.com/invoices/invoice-004.pdf'
  },
  {
    id: 5,
    invoiceNumber: 'FACT-2023-005',
    invoiceDate: '2023-04-10',
    orderId: 3,
    orderNumber: 'CMD-2023-003',
    clientId: 3,
    clientName: 'Groupe 123',
    description: 'Facture pour la migration cloud - Solde',
    totalAmount: 9250,
    paymentTerms: '30 jours',
    dueDate: '2023-05-10',
    status: 'OVERDUE',
    pdfUrl: 'https://example.com/invoices/invoice-005.pdf'
  }
];

export const fetchInvoices = async (): Promise<Invoice[]> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('invoices').select('*').order('invoiceDate', { ascending: false });
    // if (error) throw error;
    // return data || [];
    
    // Pour l'instant, retourner les données fictives
    return Promise.resolve(mockInvoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
};

export const fetchInvoicesByOrderId = async (orderId: number): Promise<Invoice[]> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('invoices').select('*').eq('orderId', orderId).order('invoiceDate', { ascending: false });
    // if (error) throw error;
    // return data || [];
    
    // Pour l'instant, filtrer les données fictives
    const invoices = mockInvoices.filter(invoice => invoice.orderId === orderId);
    return Promise.resolve(invoices);
  } catch (error) {
    console.error(`Error fetching invoices for order ${orderId}:`, error);
    return [];
  }
};

export const addInvoice = async (invoice: Partial<Invoice>): Promise<Invoice> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('invoices').insert([invoice]).select().single();
    // if (error) throw error;
    // return data;
    
    // Pour l'instant, simuler l'ajout aux données fictives
    const newInvoice: Invoice = {
      id: mockInvoices.length + 1,
      invoiceNumber: `FACT-${new Date().getFullYear()}-${String(mockInvoices.length + 1).padStart(3, '0')}`,
      invoiceDate: invoice.invoiceDate || new Date().toISOString().split('T')[0],
      orderId: invoice.orderId || 1,
      orderNumber: invoice.orderNumber || 'CMD-XXXX-XXX',
      clientId: invoice.clientId || 1,
      clientName: invoice.clientName || 'Client inconnu',
      description: invoice.description || '',
      totalAmount: invoice.totalAmount || 0,
      paymentTerms: invoice.paymentTerms || '30 jours',
      dueDate: invoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: invoice.status || 'PENDING',
      pdfUrl: invoice.pdfUrl
    };
    mockInvoices.push(newInvoice);
    return Promise.resolve(newInvoice);
  } catch (error) {
    console.error('Error adding invoice:', error);
    throw error;
  }
};

export const getInvoiceById = async (id: number): Promise<Invoice> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('invoices').select('*').eq('id', id).single();
    // if (error) throw error;
    // return data;
    
    // Pour l'instant, rechercher dans les données fictives
    const invoice = mockInvoices.find(i => i.id === id);
    if (!invoice) throw new Error(`Invoice with id ${id} not found`);
    
    return Promise.resolve(invoice);
  } catch (error) {
    console.error(`Error fetching invoice with id ${id}:`, error);
    throw error;
  }
};

export const updateInvoice = async (id: number, invoice: Partial<Invoice>): Promise<Invoice> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('invoices').update(invoice).eq('id', id).select().single();
    // if (error) throw error;
    // return data;
    
    // Pour l'instant, simuler la mise à jour des données fictives
    const index = mockInvoices.findIndex(i => i.id === id);
    if (index === -1) throw new Error(`Invoice with id ${id} not found`);
    
    mockInvoices[index] = { ...mockInvoices[index], ...invoice };
    return Promise.resolve(mockInvoices[index]);
  } catch (error) {
    console.error(`Error updating invoice with id ${id}:`, error);
    throw error;
  }
};

export const updateInvoicePaymentStatus = async (id: number, status: Invoice['status']): Promise<Invoice> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('invoices').update({ status }).eq('id', id).select().single();
    // if (error) throw error;
    // return data;
    
    // Pour l'instant, simuler la mise à jour du statut de paiement
    const index = mockInvoices.findIndex(i => i.id === id);
    if (index === -1) throw new Error(`Invoice with id ${id} not found`);
    
    mockInvoices[index].status = status;
    return Promise.resolve(mockInvoices[index]);
  } catch (error) {
    console.error(`Error updating invoice payment status for id ${id}:`, error);
    throw error;
  }
};

export const deleteInvoice = async (id: number): Promise<void> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { error } = await supabase.from('invoices').delete().eq('id', id);
    // if (error) throw error;
    
    // Pour l'instant, simuler la suppression des données fictives
    const index = mockInvoices.findIndex(i => i.id === id);
    if (index === -1) throw new Error(`Invoice with id ${id} not found`);
    
    mockInvoices.splice(index, 1);
    return Promise.resolve();
  } catch (error) {
    console.error(`Error deleting invoice with id ${id}:`, error);
    throw error;
  }
};

export const importInvoicePDF = async (file: File, invoiceData: Partial<Invoice>): Promise<Invoice> => {
  try {
    // Simuler l'upload d'un fichier
    console.log(`Simulating upload of file: ${file.name}`);
    
    // Créer une URL fictive pour le PDF
    const mockPdfUrl = `https://example.com/invoices/${Date.now()}_${file.name}`;
    
    // Créer la facture avec l'URL du PDF
    const invoiceWithUrl: Partial<Invoice> = {
      ...invoiceData,
      pdfUrl: mockPdfUrl
    };
    
    return addInvoice(invoiceWithUrl);
  } catch (error) {
    console.error('Error importing invoice PDF:', error);
    throw error;
  }
};