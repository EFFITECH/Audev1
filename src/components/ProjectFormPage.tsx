import React from 'react';

const ProjectFormPage: React.FC<{ onProjectAdded: () => void }> = ({ onProjectAdded }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Formulaire de projet
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Cette fonctionnalité sera implémentée prochainement.
      </p>
    </div>
  );
};

export default ProjectFormPage;