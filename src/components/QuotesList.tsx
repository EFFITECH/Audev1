import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Quote, Client } from '../types';
import { FileText, Calendar, User, DollarSign, Edit, Trash2, ShoppingCart } from 'lucide-react';

type QuotesListProps = {
  quotes: Quote[];
  clients: Client[];
  onDeleteQuote: (id: number) => void;
  onConvertToOrder: (id: number) => void;
};

export const QuotesList: React.FC<QuotesListProps> = ({ 
  quotes, 
  clients, 
  onDeleteQuote,
  onConvertToOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'brouillon':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'envoyé':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'accepté':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'refusé':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'expiré':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.projectName && quote.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      quote.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const isQuoteExpired = (validUntil: string) => {
    const today = new Date();
    const expiryDate = new Date(validUntil);
    return expiryDate < today;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-dark-text">Devis</h2>
        <Link to="/quotes/new" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Créer un devis
        </Link>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Rechercher un devis..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md dark:bg-dark-input dark:text-dark-text dark:border-dark-border"
          >
            <option value="all">Tous les statuts</option>
            <option value="brouillon">Brouillon</option>
            <option value="envoyé">Envoyé</option>
            <option value="accepté">Accepté</option>
            <option value="refusé">Refusé</option>
            <option value="expiré">Expiré</option>
          </select>
        </div>
      </div>

      {filteredQuotes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-dark-muted">Aucun devis trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredQuotes.map(quote => (
            <div 
              key={quote.id} 
              className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-dark-border"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                      <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg dark:text-dark-text">{quote.quoteNumber}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor(quote.status)}`}>
                          {quote.status}
                        </span>
                        {quote.convertedToOrderId && (
                          <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            Converti en commande
                          </span>
                        )}
                        {quote.status === 'envoyé' && isQuoteExpired(quote.validUntil) && (
                          <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Expiré
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {quote.status === 'accepté' && !quote.convertedToOrderId && (
                      <button
                        onClick={() => onConvertToOrder(quote.id || 0)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        title="Convertir en commande"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    )}
                    <Link 
                      to={`/quotes/edit/${quote.id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Modifier"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => onDeleteQuote(quote.id || 0)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Supprimer"
                      disabled={!!quote.convertedToOrderId}
                    >
                      <Trash2 size={18} className={quote.convertedToOrderId ? 'opacity-50 cursor-not-allowed' : ''} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-dark-muted">
                    <User size={16} className="mr-2" />
                    <span>Client: {quote.clientName}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-dark-muted">
                    <Calendar size={16} className="mr-2" />
                    <span>Date: {new Date(quote.quoteDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-dark-muted">
                    <Calendar size={16} className="mr-2" />
                    <span className={isQuoteExpired(quote.validUntil) && quote.status !== 'accepté' && quote.status !== 'refusé' ? 'text-red-600 dark:text-red-400' : ''}>
                      Valide jusqu'au: {new Date(quote.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {quote.projectName && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-dark-muted">
                    Projet: {quote.projectName}
                  </div>
                )}
                
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-border flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-dark-muted">
                      {quote.items.length} {quote.items.length > 1 ? 'éléments' : 'élément'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-1 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium dark:text-dark-text">{quote.totalTTC.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};