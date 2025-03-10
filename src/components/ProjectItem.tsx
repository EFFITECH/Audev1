import React, { useState } from 'react';
import { Project, Client } from '../types';
import { Briefcase, Calendar, User, DollarSign, MoreVertical, Edit, Trash2 } from 'lucide-react';

type ProjectItemProps = {
  project: Project;
  client?: Client;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
};

export const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  client,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    onEdit(project);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le projet ${project.name} ?`)) {
      onDelete(project.id || 0);
    }
    setShowMenu(false);
  };

  const getStatusColor = () => {
    switch (project.status) {
      case 'en cours':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'terminé':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'en pause':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'annulé':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden mb-4 border border-gray-200 dark:border-dark-border">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full mr-3">
              <Briefcase size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-medium text-lg dark:text-dark-text">{project.name}</h3>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor()}`}>
                  {project.status}
                </span>
                {client && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-dark-muted">
                    Client: {client.name}
                  </span>
                )}
              </div>
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
        
        {project.description && (
          <p className="mt-3 text-sm text-gray-600 dark:text-dark-muted">{project.description}</p>
        )}
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="flex items-center text-sm">
            <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
            <span className="dark:text-dark-text">
              Début: {project.startDate}
              {project.endDate && <> • Fin: {project.endDate}</>}
            </span>
          </div>
          
          {client && (
            <div className="flex items-center text-sm">
              <User size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
              <span className="dark:text-dark-text">{client.name}</span>
            </div>
          )}
          
          {project.budget > 0 && (
            <div className="flex items-center text-sm">
              <DollarSign size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
              <span className="dark:text-dark-text">Budget: {project.budget.toFixed(2)} €</span>
            </div>
          )}
        </div>
        
        {project.notes && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-border">
            <p className="text-sm text-gray-600 dark:text-dark-muted">{project.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};