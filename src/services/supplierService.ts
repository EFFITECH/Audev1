import { supabase } from '../lib/supabase';
import { Supplier } from '../types';

// Fonction pour obtenir les fournisseurs depuis localStorage ou initialiser avec des données par défaut
const getStoredSuppliers = (): Supplier[] => {
  const storedSuppliers = localStorage.getItem('mockSuppliers');
  if (storedSuppliers) {
    return JSON.parse(storedSuppliers);
  }
  
  // Données fictives initiales
  const initialSuppliers: Supplier[] = [
    {
      id: 1,
      name: 'Fournisseur A',
      email: 'contact@fournisseura.com',
      phone: '01 23 45 67 89',
      contact: 'Jean Dupont',
      bankInfo: 'FR76 1234 5678 9012 3456 7890 123',
      category: 'Matériel informatique'
    },
    {
      id: 2,
      name: 'Fournisseur B',
      email: 'info@fournisseurb.com',
      phone: '01 98 76 54 32',
      contact: 'Marie Martin',
      bankInfo: 'FR76 9876 5432 1098 7654 3210 987',
      category: 'Fournitures de bureau'
    },
    {
      id: 3,
      name: 'Fournisseur C',
      email: 'contact@fournisseurc.com',
      phone: '01 45 67 89 10',
      contact: 'Pierre Durand',
      bankInfo: 'FR76 5678 9012 3456 7890 1234 567',
      category: 'Services informatiques'
    }
  ];
  
  // Stocker les données initiales dans localStorage
  localStorage.setItem('mockSuppliers', JSON.stringify(initialSuppliers));
  
  return initialSuppliers;
};

// Fonction pour sauvegarder les fournisseurs dans localStorage
const saveSuppliers = (suppliers: Supplier[]): void => {
  localStorage.setItem('mockSuppliers', JSON.stringify(suppliers));
};

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  try {
    // Uncomment when Supabase is set up
    // const { data, error } = await supabase.from('suppliers').select('*').order('name');
    // if (error) throw error;
    // return data || [];
    
    // For now, return mock data from localStorage
    return Promise.resolve(getStoredSuppliers());
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
};

export const getSupplierById = async (id: number): Promise<Supplier> => {
  try {
    // Uncomment when Supabase is set up
    // const { data, error } = await supabase.from('suppliers').select('*').eq('id', id).single();
    // if (error) throw error;
    // return data;
    
    // For now, return mock data from localStorage
    const suppliers = getStoredSuppliers();
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) throw new Error(`Supplier with id ${id} not found`);
    return Promise.resolve(supplier);
  } catch (error) {
    console.error(`Error fetching supplier with id ${id}:`, error);
    throw error;
  }
};

export const addSupplier = async (supplier: Partial<Supplier>): Promise<Supplier> => {
  try {
    // Uncomment when Supabase is set up
    // const { data, error } = await supabase.from('suppliers').insert([supplier]).select().single();
    // if (error) throw error;
    // return data;
    
    // For now, simulate adding to mock data in localStorage
    const suppliers = getStoredSuppliers();
    
    // Trouver le plus grand ID existant et ajouter 1
    const maxId = suppliers.reduce((max, s) => (s.id && s.id > max ? s.id : max), 0);
    
    const newSupplier: Supplier = {
      id: maxId + 1,
      name: supplier.name || 'Unnamed Supplier',
      email: supplier.email || '',
      phone: supplier.phone || '',
      contact: supplier.contact || '',
      bankInfo: supplier.bankInfo || '',
      category: supplier.category || ''
    };
    
    suppliers.push(newSupplier);
    saveSuppliers(suppliers);
    
    return Promise.resolve(newSupplier);
  } catch (error) {
    console.error('Error adding supplier:', error);
    throw error;
  }
};

export const updateSupplier = async (id: number, supplier: Partial<Supplier>): Promise<Supplier> => {
  try {
    // Uncomment when Supabase is set up
    // const { data, error } = await supabase.from('suppliers').update(supplier).eq('id', id).select().single();
    // if (error) throw error;
    // return data;
    
    // For now, simulate updating mock data in localStorage
    const suppliers = getStoredSuppliers();
    const index = suppliers.findIndex(s => s.id === id);
    
    if (index === -1) throw new Error(`Supplier with id ${id} not found`);
    
    suppliers[index] = { ...suppliers[index], ...supplier };
    saveSuppliers(suppliers);
    
    return Promise.resolve(suppliers[index]);
  } catch (error) {
    console.error(`Error updating supplier with id ${id}:`, error);
    throw error;
  }
};

export const deleteSupplier = async (id: number): Promise<void> => {
  try {
    // Uncomment when Supabase is set up
    // const { error } = await supabase.from('suppliers').delete().eq('id', id);
    // if (error) throw error;
    
    // For now, simulate deleting from mock data in localStorage
    const suppliers = getStoredSuppliers();
    const index = suppliers.findIndex(s => s.id === id);
    
    if (index === -1) throw new Error(`Supplier with id ${id} not found`);
    
    suppliers.splice(index, 1);
    saveSuppliers(suppliers);
    
    return Promise.resolve();
  } catch (error) {
    console.error(`Error deleting supplier with id ${id}:`, error);
    throw error;
  }
};