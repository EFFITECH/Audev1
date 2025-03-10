import { supabase } from '../lib/supabase';
import { Order } from '../types';

// Données fictives pour le développement
const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'CMD-2023-001',
    orderDate: '2023-01-20',
    clientId: 1,
    clientName: 'Entreprise ABC',
    projectId: 1,
    projectName: 'Refonte du site web',
    description: 'Commande initiale pour le projet de refonte',
    status: 'reçue',
    totalAmount: 15000,
    paymentDueDate: '2023-02-20',
    paymentStatus: 'payé',
    supplierId: 1
  },
  {
    id: 2,
    orderNumber: 'CMD-2023-002',
    orderDate: '2023-03-15',
    clientId: 2,
    clientName: 'Société XYZ',
    projectId: 2,
    projectName: 'Développement application mobile',
    description: 'Phase 1 du développement de l\'application',
    status: 'envoyée',
    totalAmount: 25000,
    paymentDueDate: '2023-04-15',
    paymentStatus: 'non payé',
    supplierId: 2
  },
  {
    id: 3,
    orderNumber: 'CMD-2023-003',
    orderDate: '2023-02-28',
    clientId: 3,
    clientName: 'Groupe 123',
    projectId: 3,
    projectName: 'Migration infrastructure cloud',
    description: 'Services de migration vers le cloud',
    status: 'partiellement reçue',
    totalAmount: 18500,
    paymentDueDate: '2023-03-30',
    paymentStatus: 'partiellement payé',
    supplierId: 3
  }
];

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('orders').select('*').order('orderDate', { ascending: false });
    // if (error) throw error;
    // return data || [];
    
    // Pour l'instant, retourner les données fictives
    return Promise.resolve(mockOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const addOrder = async (order: Partial<Order>): Promise<Order> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('orders').insert([order]).select().single();
    // if (error) throw error;
    // return data;
    
    // Pour l'instant, simuler l'ajout aux données fictives
    const newOrder: Order = {
      id: mockOrders.length + 1,
      orderNumber: `CMD-${new Date().getFullYear()}-${String(mockOrders.length + 1).padStart(3, '0')}`,
      orderDate: order.orderDate || new Date().toISOString().split('T')[0],
      clientId: order.clientId || 1,
      clientName: order.clientName || 'Client inconnu',
      projectId: order.projectId,
      projectName: order.projectName || '',
      description: order.description || '',
      status: order.status || 'en attente',
      totalAmount: order.totalAmount || 0,
      paymentDueDate: order.paymentDueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentStatus: order.paymentStatus || 'non payé',
      supplierId: order.supplierId || 1
    };
    mockOrders.push(newOrder);
    return Promise.resolve(newOrder);
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

export const updateOrder = async (id: number, order: Partial<Order>): Promise<Order> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('orders').update(order).eq('id', id).select().single();
    // if (error) throw error;
    // return data;
    
    // Pour l'instant, simuler la mise à jour des données fictives
    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) throw new Error(`Order with id ${id} not found`);
    
    mockOrders[index] = { ...mockOrders[index], ...order };
    return Promise.resolve(mockOrders[index]);
  } catch (error) {
    console.error(`Error updating order with id ${id}:`, error);
    throw error;
  }
};

export const updateOrderPaymentStatus = async (id: number, paymentStatus: Order['paymentStatus']): Promise<Order> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('orders').update({ paymentStatus }).eq('id', id).select().single();
    // if (error) throw error;
    // return data;
    
    // Pour l'instant, simuler la mise à jour du statut de paiement
    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) throw new Error(`Order with id ${id} not found`);
    
    mockOrders[index].paymentStatus = paymentStatus;
    return Promise.resolve(mockOrders[index]);
  } catch (error) {
    console.error(`Error updating order payment status for id ${id}:`, error);
    throw error;
  }
};

export const getOrderById = async (id: number): Promise<Order> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
    // if (error) throw error;
    // return data;
    
    // Pour l'instant, rechercher dans les données fictives
    const order = mockOrders.find(o => o.id === id);
    if (!order) throw new Error(`Order with id ${id} not found`);
    
    return Promise.resolve(order);
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    throw error;
  }
};

export const deleteOrder = async (id: number): Promise<void> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { error } = await supabase.from('orders').delete().eq('id', id);
    // if (error) throw error;
    
    // Pour l'instant, simuler la suppression des données fictives
    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) throw new Error(`Order with id ${id} not found`);
    
    mockOrders.splice(index, 1);
    return Promise.resolve();
  } catch (error) {
    console.error(`Error deleting order with id ${id}:`, error);
    throw error;
  }
};