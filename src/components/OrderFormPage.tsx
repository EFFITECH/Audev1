import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order, Supplier, Project } from '../types';
import { OrderForm } from './OrderForm';
import { getOrderById, createOrder, updateOrder, fetchSuppliers, fetchProjects } from '../api';

type OrderFormPageProps = {
  onOrderAdded: () => void;
};

const OrderFormPage: React.FC<OrderFormPageProps> = ({ onOrderAdded }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch suppliers and projects for the dropdowns
        const suppliersData = await fetchSuppliers();
        const projectsData = await fetchProjects();
        setSuppliers(suppliersData);
        setProjects(projectsData);
        
        // If editing, fetch the order
        if (id) {
          const orderData = await getOrderById(parseInt(id, 10));
          setOrder(orderData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (orderData: Order) => {
    try {
      setLoading(true);
      if (id) {
        await updateOrder(parseInt(id, 10), orderData);
      } else {
        await createOrder(orderData);
      }
      setLoading(false);
      onOrderAdded();
      navigate('/orders');
    } catch (err) {
      console.error('Error saving order:', err);
      setError('Erreur lors de l\'enregistrement de la commande');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card shadow-md rounded-lg p-6">
      <OrderForm
        order={id ? order || undefined : undefined}
        suppliers={suppliers}
        projects={projects}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default OrderFormPage;