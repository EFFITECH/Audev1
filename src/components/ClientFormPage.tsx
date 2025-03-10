import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '../types';
import { fetchClientById, createClient, updateClient } from '../api';
import ClientForm from './ClientForm';

interface ClientFormPageProps {
  onClientAdded: () => void;
}

const ClientFormPage: React.FC<ClientFormPageProps> = ({ onClientAdded }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | undefined>(undefined);
  
  // Chargement des données du client si on est en mode édition
  useEffect(() => {
    const loadClient = async () => {
      if (!id) return; // Mode création
      
      try {
        setLoading(true);
        const clientData = await fetchClientById(id);
        
        if (!clientData) {
          setError("Client non trouvé");
          return;
        }
        
        setClient(clientData);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement du client:", err);
        setError("Impossible de charger les données du client");
      } finally {
        setLoading(false);
      }
    };
    
    loadClient();
  }, [id]);
  
  // Soumission du formulaire
  const handleSubmit = async (clientData: Client) => {
    try {
      setLoading(true);
      
      if (id) {
        // Mode édition
        await updateClient(id, clientData);
      } else {
        // Mode création
        await createClient(clientData);
      }
      
      onClientAdded();
      navigate('/clients');
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du client:", err);
      setError("Impossible d'enregistrer le client");
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/clients');
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {id ? 'Modifier le client' : 'Ajouter un client'}
      </h2>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {loading && !client && id ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ClientForm 
            initialData={client} 
            onSubmit={handleSubmit} 
            onCancel={handleCancel} 
          />
        )}
      </div>
    </div>
  );
};

export default ClientFormPage;