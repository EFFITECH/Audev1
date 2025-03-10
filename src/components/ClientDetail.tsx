import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Client } from '../types';
import { fetchClientById } from '../api';

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadClient = async () => {
      if (!id) {
        setError("ID du client non spécifié");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const clientData = await fetchClientById(id);
        
        if (!clientData) {
          setError("Client non trouvé");
          setLoading(false);
          return;
        }
        
        setClient(clientData);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement du client:", err);
        setError("Impossible de charger les détails du client");
      } finally {
        setLoading(false);
      }
    };
    
    loadClient();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !client) {
    return (
      <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Erreur</h3>
        <p>{error || "Une erreur inconnue est survenue"}</p>
        <button
          onClick={() => navigate('/clients')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Retour à la liste des clients
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Détails du client</h2>
        <div className="space-x-2">
          <Link
            to={`/clients/edit/${client.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block"
          >
            Modifier
          </Link>
          <Link
            to="/clients"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg inline-block"
          >
            Retour
          </Link>
        </div>
      </div>
      
      {/* Informations du client */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{client.name}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Email:</span> {client.email}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Téléphone:</span> {client.phone}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Adresse:</span> {client.address}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Client depuis:</span> {new Date(client.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;