import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ShoppingCart, 
  Users, 
  Briefcase, 
  TrendingUp, 
  CreditCard, 
  ChevronRight 
} from 'lucide-react';

export const WorkflowDiagram: React.FC = () => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-dark-text">Cycle commercial</h2>
      
      <div className="flex flex-col md:flex-row items-center justify-between">
        <WorkflowStep 
          icon={<FileText className="text-blue-500" />}
          title="Devis"
          description="Créez et envoyez des devis à vos clients"
          link="/quotes"
        />
        
        <ChevronRight className="hidden md:block text-gray-400 dark:text-gray-600" />
        
        <WorkflowStep 
          icon={<ShoppingCart className="text-green-500" />}
          title="Commandes clients"
          description="Gérez les commandes de vos clients"
          link="/client-orders"
        />
        
        <ChevronRight className="hidden md:block text-gray-400 dark:text-gray-600" />
        
        <WorkflowStep 
          icon={<TrendingUp className="text-purple-500" />}
          title="Commandes fournisseurs"
          description="Passez des commandes à vos fournisseurs"
          link="/supplier-orders"
        />
        
        <ChevronRight className="hidden md:block text-gray-400 dark:text-gray-600" />
        
        <WorkflowStep 
          icon={<CreditCard className="text-yellow-500" />}
          title="Factures"
          description="Gérez vos factures clients et fournisseurs"
          link="/invoices"
        />
      </div>
      
      <div className="mt-8 flex flex-col md:flex-row items-center justify-around">
        <WorkflowStep 
          icon={<Users className="text-indigo-500" />}
          title="Clients"
          description="Gérez votre base de clients"
          link="/clients"
        />
        
        <WorkflowStep 
          icon={<Users className="text-red-500" />}
          title="Fournisseurs"
          description="Gérez vos fournisseurs"
          link="/suppliers"
        />
        
        <WorkflowStep 
          icon={<Briefcase className="text-orange-500" />}
          title="Projets"
          description="Suivez l'avancement de vos projets"
          link="/projects"
        />
      </div>
    </div>
  );
};

type WorkflowStepProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
};

const WorkflowStep: React.FC<WorkflowStepProps> = ({ icon, title, description, link }) => {
  return (
    <Link 
      to={link}
      className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-4 md:mb-0"
    >
      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
        {icon}
      </div>
      <h3 className="font-medium text-lg mb-1 dark:text-dark-text">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-dark-muted">{description}</p>
    </Link>
  );
};