import React, { useState } from 'react';
import { Supplier } from '../types';
import { Building2, Phone, Mail, MapPin, MoreVertical, Edit, Trash2 } from 'lucide-react';

type SupplierItemProps = {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: number) => void;
};

export const SupplierItem: React.FC<SupplierItemProps> = ({
  supplier,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    onEdit(supplier);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le fournisseur ${supplier.name} ?`)) {
      onDelete(supplier.id || 0);
    }
    setShowMenu(false);
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden mb-4 border border-gray-200 dark:border-dark-border">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
              <Building2 size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-lg dark:text-dark-text">{supplier.name}</h3>
              {supplier.contactName && (
                <p className="text-sm text-gray-500 dark:text-dark-muted">
                  Contact: {supplier.contactName}
                </p>
              )}
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MoreVertical size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-md shadow-lg z-10 border border-gray-200 dark:border-dark-border">
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Edit size={16} className="mr-2" />
                    Modifier
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {supplier.email && (
            <div className="flex items-center text-sm">
              <Mail size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
              <span className="dark:text-dark-text">{supplier.email}</span>
            </div>
          )}
          
          {supplier.phone && (
            <div className="flex items-center text-sm">
              <Phone size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
              <span className="dark:text-dark-text">{supplier.phone}</span>
            </div>
          )}
          
          {supplier.address && (
            <div className="flex items-center text-sm col-span-2">
              <MapPin size={16} className="mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="dark:text-dark-text">
                {supplier.address}
                {(supplier.postalCode || supplier.city) && (
                  <>, ${supplier.postalCode} ${supplier.city}</>
                )}
                {supplier.country && supplier.country !== 'France' && (
                  <>, ${supplier.country}</>
                )}
              </span>
            </div>
          )}
        </div>
        
        {supplier.notes && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-border">
            <p className="text-sm text-gray-600 dark:text-dark-muted">{supplier.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};