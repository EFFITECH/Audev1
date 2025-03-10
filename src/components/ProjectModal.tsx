import React from 'react';
import { Project, Client } from '../types';
import { ProjectForm } from './ProjectForm';
import { X } from 'lucide-react';

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  clients: Client[];
  onSubmit: (project: Project) => void;
  title?: string;
};

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  clients,
  onSubmit,
  title,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (updatedProject: Project) => {
    onSubmit(updatedProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div 
          className="inline-block align-bottom bg-white dark:bg-dark-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-headline"
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white dark:bg-transparent rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
            >
              <span className="sr-only">Fermer</span>
              <X size={24} />
            </button>
          </div>
          
          <div className="p-6">
            <ProjectForm
              project={project}
              clients={clients}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};