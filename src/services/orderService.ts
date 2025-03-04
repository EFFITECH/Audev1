import { supabase } from '../lib/supabase';
import { Order } from '../types';

export const fetchOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const addOrder = async (order: Partial<Order>): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();

  if (error) {
    console.error('Error adding order:', error);
    throw new Error(error.message);
  }

  return data;
};

export const updateOrder = async (id: number, order: Partial<Order>): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update(order)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating order:', error);
    throw new Error(error.message);
  }

  return data;
};

export const updateOrderPaymentStatus = async (id: number, paymentStatus: Order['paymentStatus']): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ paymentStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating order payment status:', error);
    throw new Error(error.message);
  }

  return data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting order:', error);
    throw new Error(error.message);
  }
};