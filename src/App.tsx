import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { Client } from './types';
import logo from './images/logo.png';

// Ajout des styles globaux pour la police
const appStyle = {
  fontFamily: "'Roboto', 'Open Sans', sans-serif"
};

// Version minimale pour tester le fonctionnement de base
function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fonction pour ajouter un client
  const addClient = (newClient: Client) => {
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    // Sauvegarder dans localStorage
    localStorage.setItem('effitech_clients', JSON.stringify(updatedClients));
  };

  // Fonction pour supprimer un client
  const deleteClient = (id: string) => {
    const updatedClients = clients.filter(client => client.id !== id);
    setClients(updatedClients);
    // Mettre à jour localStorage
    localStorage.setItem('effitech_clients', JSON.stringify(updatedClients));
  };

  // Chargement des clients depuis localStorage et ajout d'un client fictif si nécessaire
  useEffect(() => {
    // Récupérer les clients depuis localStorage
    const savedClients = localStorage.getItem('effitech_clients');
    
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      // Création d'un client de test si la liste est vide
      const testClient: Client = {
        id: "test-client-1",
        name: "Client de Test",
        email: "test@example.com",
        phone: "01 23 45 67 89",
        address: "123 Rue de Test, 75000 Paris",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const initialClients = [testClient];
      setClients(initialClients);
      // Sauvegarder dans localStorage
      localStorage.setItem('effitech_clients', JSON.stringify(initialClients));
    }
  }, []);

  // Interface utilisateur simplifiée
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white" style={appStyle}>
          <header className="bg-white dark:bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <Link to="/">
                  <img src={logo} alt="Effitech Logo" className="h-24 mr-3" />
                </Link>
              </div>
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/clients" element={<ClientsPage clients={clients} onDelete={deleteClient} />} />
              <Route path="/clients/new" element={<ClientFormPage onAdd={addClient} />} />
              <Route path="/suppliers" element={<PlaceholderPage title="Gestion des fournisseurs" />} />
              <Route path="/projects" element={<PlaceholderPage title="Gestion des projets" />} />
              <Route path="/orders" element={<PlaceholderPage title="Gestion des commandes" />} />
              <Route path="/invoices" element={<PlaceholderPage title="Gestion des factures" />} />
              <Route path="/payment-calendar" element={<PlaceholderPage title="Calendrier de paiement" />} />
            </Routes>
          </main>

          <footer className="bg-white dark:bg-gray-800 p-4 mt-8 text-gray-600 dark:text-gray-400">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p>© {new Date().getFullYear()} <span className="text-[#00AEEF] font-bold">Effitech Hub</span> - Tous droits réservés</p>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-[#00AEEF] transition-colors">Aide</a>
                  <a href="#" className="hover:text-[#00AEEF] transition-colors">Contact</a>
                  <a href="#" className="hover:text-[#00AEEF] transition-colors">Mentions légales</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

// Composant Home simplifié
function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center max-w-2xl mx-auto mb-6">
        <h2 className="text-4xl font-bold mb-4 text-[#00AEEF]">Bienvenue sur Effitech Hub</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">🚀 Notre solution tout-en-un pour la gestion d'entreprise</p>
        
        {/* Section de navigation des modules principaux - Design amélioré */}
        <div className="mb-12 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Commandes en cours */}
            <Link to="/orders" className="group h-full">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-md p-4 transition-all duration-300 group-hover:shadow-lg group-hover:scale-102 group-hover:bg-gradient-to-br group-hover:from-orange-100 group-hover:to-orange-200 dark:group-hover:from-gray-650 dark:group-hover:to-gray-750 border border-orange-200/40 dark:border-orange-700/20 relative overflow-hidden h-full flex flex-col cursor-pointer">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-3 group-hover:bg-orange-200 dark:group-hover:bg-orange-800/40 transition-colors">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <div>
                    <h3 className="text-gray-800 dark:text-white text-base font-medium group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">Commandes</h3>
                    <div className="flex items-center mt-0.5">
                      <span className="bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">3 en cours</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Factures non payées */}
            <Link to="/invoices" className="group h-full">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-md p-4 transition-all duration-300 group-hover:shadow-lg group-hover:scale-102 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-blue-200 dark:group-hover:from-gray-650 dark:group-hover:to-gray-750 border border-blue-200/40 dark:border-blue-700/20 relative overflow-hidden h-full flex flex-col cursor-pointer">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div>
                    <h3 className="text-gray-800 dark:text-white text-base font-medium group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">Factures</h3>
                    <div className="flex items-center mt-0.5">
                      <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">5 non payées</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Calendrier d'échéances */}
            <Link to="/payment-calendar" className="group h-full">
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-md p-4 transition-all duration-300 group-hover:shadow-lg group-hover:scale-102 group-hover:bg-gradient-to-br group-hover:from-green-100 group-hover:to-green-200 dark:group-hover:from-gray-650 dark:group-hover:to-gray-750 border border-green-200/40 dark:border-green-700/20 relative overflow-hidden h-full flex flex-col cursor-pointer">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3 group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div>
                    <h3 className="text-gray-800 dark:text-white text-base font-medium group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">Calendrier</h3>
                    <div className="flex items-center mt-0.5">
                      <span className="bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">4 échéances</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        <div className="bg-white/90 dark:bg-gray-600/80 rounded-lg shadow-md transition-all transform hover:scale-102 duration-300 overflow-hidden hover:bg-blue-50/90 dark:hover:bg-gray-550/90 group cursor-pointer">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3 group-hover:scale-110 transition-transform">👥</span>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-[#00AEEF] dark:group-hover:text-[#00AEEF] transition-colors">Gestion des clients</h3>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Ajoutez, modifiez et consultez vos clients.</p>
            <div className="flex justify-end">
              <Link to="/clients" className="text-[#00AEEF] group-hover:text-[#0090c5] font-medium transition-colors">
                Accéder
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white/90 dark:bg-gray-600/80 rounded-lg shadow-md transition-all transform hover:scale-102 duration-300 overflow-hidden hover:bg-green-50/90 dark:hover:bg-gray-550/90 group cursor-pointer">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3 group-hover:scale-110 transition-transform">🏭</span>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-[#28A745] dark:group-hover:text-[#28A745] transition-colors">Gestion des fournisseurs</h3>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Ajoutez, modifiez et consultez vos fournisseurs.</p>
            <div className="flex justify-end">
              <Link to="/suppliers" className="text-[#28A745] group-hover:text-[#219538] font-medium transition-colors">
                Accéder
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white/90 dark:bg-gray-600/80 rounded-lg shadow-md transition-all transform hover:scale-102 duration-300 overflow-hidden hover:bg-purple-50/90 dark:hover:bg-gray-550/90 group cursor-pointer">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3 group-hover:scale-110 transition-transform">📂</span>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-[#6A1B9A] dark:group-hover:text-[#9C27B0] transition-colors">Gestion des projets</h3>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Ajoutez, modifiez et consultez vos projets.</p>
            <div className="flex justify-end">
              <Link to="/projects" className="text-[#6A1B9A] group-hover:text-[#9C27B0] font-medium transition-colors">
                Accéder
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white/90 dark:bg-gray-600/80 rounded-lg shadow-md transition-all transform hover:scale-102 duration-300 overflow-hidden hover:bg-amber-50/90 dark:hover:bg-gray-550/90 group cursor-pointer">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3 group-hover:scale-110 transition-transform">🛒</span>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-[#FF9800] dark:group-hover:text-[#FF9800] transition-colors">Gestion des commandes</h3>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Ajoutez, modifiez et consultez vos commandes.</p>
            <div className="flex justify-end">
              <Link to="/orders" className="text-[#FF9800] group-hover:text-[#E68A00] font-medium transition-colors">
                Accéder
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white/90 dark:bg-gray-600/80 rounded-lg shadow-md transition-all transform hover:scale-102 duration-300 overflow-hidden hover:bg-sky-50/90 dark:hover:bg-gray-550/90 group cursor-pointer">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3 group-hover:scale-110 transition-transform">📄</span>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-[#00AEEF] dark:group-hover:text-[#00AEEF] transition-colors">Gestion des factures</h3>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Ajoutez, modifiez et consultez vos factures.</p>
            <div className="flex justify-end">
              <Link to="/invoices" className="text-[#00AEEF] group-hover:text-[#0090c5] font-medium transition-colors">
                Accéder
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white/90 dark:bg-gray-600/80 rounded-lg shadow-md transition-all transform hover:scale-102 duration-300 overflow-hidden hover:bg-emerald-50/90 dark:hover:bg-gray-550/90 group cursor-pointer">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3 group-hover:scale-110 transition-transform">📅</span>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-[#28A745] dark:group-hover:text-[#28A745] transition-colors">Calendrier de paiement</h3>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Consultez les échéances de paiement.</p>
            <div className="flex justify-end">
              <Link to="/payment-calendar" className="text-[#28A745] group-hover:text-[#219538] font-medium transition-colors">
                Accéder
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher la liste des clients
function ClientsPage({ clients, onDelete }: { clients: Client[], onDelete: (id: string) => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#00AEEF]">Liste des clients</h2>
        <Link
          to="/clients/new"
          className="bg-[#28A745] hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <span className="mr-2">+</span> Ajouter un client
        </Link>
      </div>
      
      {clients.length === 0 ? (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-400">Aucun client trouvé.</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onDelete(client.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Composant pour le formulaire client simplifié
function ClientFormPage({ onAdd }: { onAdd: (client: Client) => void }) {
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClient: Client = {
      id: Math.random().toString(36).substring(2, 15),
      ...clientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onAdd(newClient);
    navigate('/clients');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#00AEEF] mb-6">
        Ajouter un client
      </h2>
      
      <div className="bg-gray-800 dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nom du client
            </label>
            <input
              type="text"
              name="name"
              value={clientData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF]"
              placeholder="Nom de l'entreprise ou du client"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={clientData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF]"
              placeholder="email@exemple.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={clientData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF]"
              placeholder="01 23 45 67 89"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Adresse
            </label>
            <input
              type="text"
              name="address"
              value={clientData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF]"
              placeholder="Adresse complète"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={clientData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF]"
              placeholder="Notes supplémentaires"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Link
              to="/clients"
              className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#28A745] hover:bg-green-600 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Composant pour visualiser un client
function ClientViewPage({ clients }: { clients: Client[] }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Recherche du client par son ID
  const client = clients.find(c => c.id === id);
  
  // Si le client n'existe pas
  if (!client) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#00AEEF] mb-6">Client introuvable</h2>
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-300 mb-4">Le client demandé n'existe pas ou a été supprimé.</p>
          <button 
            onClick={() => navigate('/clients')}
            className="inline-block bg-[#00AEEF] hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }
  
  // Format des dates
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#00AEEF]">Fiche client</h2>
        <button
          onClick={() => navigate('/clients')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retour à la liste
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6">{client.name}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-1">Coordonnées</p>
                <p className="text-white">
                  <span className="inline-block w-20 text-gray-400">Email:</span> 
                  {client.email || 'Non renseigné'}
                </p>
                <p className="text-white">
                  <span className="inline-block w-20 text-gray-400">Téléphone:</span>
                  {client.phone || 'Non renseigné'}
                </p>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-1">Adresse</p>
                <p className="text-white">{client.address || 'Non renseignée'}</p>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-1">Notes</p>
                <p className="text-white bg-gray-700 p-3 rounded-md min-h-[100px]">
                  {client.notes || 'Aucune note'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 pt-4">
            <p className="text-gray-400 text-sm">
              Client créé le: {formatDate(client.createdAt)}
            </p>
            <p className="text-gray-400 text-sm">
              Dernière modification: {formatDate(client.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour les pages en attente d'implémentation
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-bold text-[#00AEEF] mb-6">{title}</h2>
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-300 mb-4">
          Cette fonctionnalité est en cours de développement et sera bientôt disponible.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#00AEEF] hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default App;