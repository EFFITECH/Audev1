// Ce fichier est maintenant un wrapper autour des services Supabase
// Il maintient la même interface API pour éviter de modifier le reste de l'application

import { Supplier, Order, Invoice, Project } from './types';
import * as supplierService from './services/supplierService';
import * as projectService from './services/projectService';
import * as orderService from './services/orderService';
import * as invoiceService from './services/invoiceService';

// Suppliers
export const fetchSuppliers = (): Promise<Supplier[]> => {
  return supplierService.fetchSuppliers();
};

export const addSupplier = (supplier: Partial<Supplier>): Promise<Supplier> => {
  return supplierService.addSupplier(supplier);
};

// Projects
export const fetchProjects = (): Promise<Project[]> => {
  return projectService.fetchProjects();
};

export const addProject = (project: Partial<Project>): Promise<Project> => {
  return projectService.addProject(project);
};

// Orders
export const fetchOrders = (): Promise<Order[]> => {
  return orderService.fetchOrders();
};

export const addOrder = (order: Partial<Order>): Promise<Order> => {
  return orderService.addOrder(order);
};

export const updateOrderPaymentStatus = (orderId: number, paymentStatus: Order['paymentStatus']): Promise<Order> => {
  return orderService.updateOrderPaymentStatus(orderId, paymentStatus);
};

// Invoices
export const fetchInvoices = (): Promise<Invoice[]> => {
  return invoiceService.fetchInvoices();
};

export const fetchInvoicesByOrderId = (orderId: number): Promise<Invoice[]> => {
  return invoiceService.fetchInvoicesByOrderId(orderId);
};

export const addInvoice = (invoice: Partial<Invoice>): Promise<Invoice> => {
  return invoiceService.addInvoice(invoice);
};

export const updateInvoicePaymentStatus = (invoiceId: number, paymentStatus: Invoice['paymentStatus']): Promise<Invoice> => {
  return invoiceService.updateInvoicePaymentStatus(invoiceId, paymentStatus);
};

export const importInvoicePDF = async (file: File, orderId?: number): Promise<{ success: boolean, pdfUrl: string }> => {
  const invoiceData: Partial<Invoice> = {
    invoiceNumber: `INV-${Date.now()}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    orderId: orderId || 1, // Use provided orderId or default to 1
    amount: 0, // Will be filled by user
    paymentTerms: '30 jours',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentStatus: 'en attente'
  };
  
  try {
    const invoice = await invoiceService.importInvoicePDF(file, invoiceData);
    return { success: true, pdfUrl: invoice.pdfUrl || '' };
  } catch (error) {
    console.error('Error importing invoice:', error);
    throw error;
  }
};