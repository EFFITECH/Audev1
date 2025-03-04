import { supabase } from '../lib/supabase';
import { Supplier } from '../types';

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching suppliers:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const addSupplier = async (supplier: Partial<Supplier>): Promise<Supplier> => {
  const { data, error } = await supabase
    .from('suppliers')
    .insert([supplier])
    .select()
    .single();

  if (error) {
    console.error('Error adding supplier:', error);
    throw new Error(error.message);
  }

  return data;
};

export const updateSupplier = async (id: number, supplier: Partial<Supplier>): Promise<Supplier> => {
  const { data, error } = await supabase
    .from('suppliers')
    .update(supplier)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating supplier:', error);
    throw new Error(error.message);
  }

  return data;
};

export const deleteSupplier = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting supplier:', error);
    throw new Error(error.message);
  }
};