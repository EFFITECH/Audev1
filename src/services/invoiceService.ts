import { supabase } from '../lib/supabase';
import { Invoice } from '../types';

export const fetchInvoices = async (): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('invoiceDate', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const fetchInvoicesByOrderId = async (orderId: number): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('orderId', orderId)
    .order('invoiceDate', { ascending: false });

  if (error) {
    console.error('Error fetching invoices for order:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const addInvoice = async (invoice: Partial<Invoice>): Promise<Invoice> => {
  const { data, error } = await supabase
    .from('invoices')
    .insert([invoice])
    .select()
    .single();

  if (error) {
    console.error('Error adding invoice:', error);
    throw new Error(error.message);
  }

  return data;
};

export const updateInvoice = async (id: number, invoice: Partial<Invoice>): Promise<Invoice> => {
  const { data, error } = await supabase
    .from('invoices')
    .update(invoice)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating invoice:', error);
    throw new Error(error.message);
  }

  return data;
};

export const updateInvoicePaymentStatus = async (id: number, paymentStatus: Invoice['paymentStatus']): Promise<Invoice> => {
  const { data, error } = await supabase
    .from('invoices')
    .update({ paymentStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating invoice payment status:', error);
    throw new Error(error.message);
  }

  return data;
};

export const deleteInvoice = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting invoice:', error);
    throw new Error(error.message);
  }
};

export const importInvoicePDF = async (file: File, invoiceData: Partial<Invoice>): Promise<Invoice> => {
  // 1. Upload the file to Supabase Storage
  const fileName = `${Date.now()}_${file.name}`;
  const { data: fileData, error: uploadError } = await supabase
    .storage
    .from('invoices')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading invoice PDF:', uploadError);
    throw new Error(uploadError.message);
  }

  // 2. Get the public URL for the uploaded file
  const { data: urlData } = await supabase
    .storage
    .from('invoices')
    .getPublicUrl(fileName);

  // 3. Create the invoice record with the file URL
  const invoiceWithUrl: Partial<Invoice> = {
    ...invoiceData,
    pdfUrl: urlData.publicUrl
  };

  return addInvoice(invoiceWithUrl);
};