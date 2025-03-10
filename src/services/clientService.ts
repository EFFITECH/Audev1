import { Client } from '../types';
import { supabase } from '../lib/supabase';

// Mock data for development
const mockClients: Client[] = [
  {
    id: 1,
    name: 'Entreprise ABC',
    email: 'contact@abc.com',
    phone: '01 23 45 67 89',
    address: '123 Rue de Paris, 75001 Paris',
    notes: 'Client régulier depuis 2020'
  },
  {
    id: 2,
    name: 'Société XYZ',
    email: 'info@xyz.com',
    phone: '01 98 76 54 32',
    address: '456 Avenue des Champs-Élysées, 75008 Paris',
    notes: 'Nouveau client depuis janvier 2023'
  },
  {
    id: 3,
    name: 'Groupe 123',
    email: 'contact@groupe123.com',
    phone: '01 45 67 89 10',
    address: '789 Boulevard Haussmann, 75009 Paris',
    notes: 'Client VIP'
  }
];

export const fetchClients = async (): Promise<Client[]> => {
  try {
    // Uncomment when Supabase is set up
    // const { data, error } = await supabase.from('clients').select('*');
    // if (error) throw error;
    // return data;
    
    // For now, return mock data
    return Promise.resolve(mockClients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
};

export const getClientById = async (id: number): Promise<Client> => {
  try {
    // Uncomment when Supabase is set up
    // const { data, error } = await supabase.from('clients').select('*').eq('id', id).single();
    // if (error) throw error;
    // return data;
    
    // For now, return mock data
    const client = mockClients.find(c => c.id === id);
    if (!client) throw new Error(`Client with id ${id} not found`);
    return Promise.resolve(client);
  } catch (error) {
    console.error(`Error fetching client with id ${id}:`, error);
    throw error;
  }
};

export const addClient = async (client: Partial<Client>): Promise<Client> => {
  try {
    // Uncomment when Supabase is set up
    // const { data, error } = await supabase.from('clients').insert(client).select().single();
    // if (error) throw error;
    // return data;
    
    // For now, simulate adding to mock data
    const newClient: Client = {
      id: mockClients.length + 1,
      name: client.name || 'Unnamed Client',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address,
      notes: client.notes
    };
    mockClients.push(newClient);
    return Promise.resolve(newClient);
  } catch (error) {
    console.error('Error adding client:', error);
    throw error;
  }
};

export const updateClient = async (id: number, client: Partial<Client>): Promise<Client> => {
  try {
    // Uncomment when Supabase is set up
    // const { data, error } = await supabase.from('clients').update(client).eq('id', id).select().single();
    // if (error) throw error;
    // return data;
    
    // For now, simulate updating mock data
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Client with id ${id} not found`);
    
    mockClients[index] = { ...mockClients[index], ...client };
    return Promise.resolve(mockClients[index]);
  } catch (error) {
    console.error(`Error updating client with id ${id}:`, error);
    throw error;
  }
};

export const deleteClient = async (id: number): Promise<void> => {
  try {
    // Uncomment when Supabase is set up
    // const { error } = await supabase.from('clients').delete().eq('id', id);
    // if (error) throw error;
    
    // For now, simulate deleting from mock data
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Client with id ${id} not found`);
    
    mockClients.splice(index, 1);
    return Promise.resolve();
  } catch (error) {
    console.error(`Error deleting client with id ${id}:`, error);
    throw error;
  }
};