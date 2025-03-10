import { supabase } from '../lib/supabase';
import { Project } from '../types';

// Données fictives pour le développement
const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Refonte du site web',
    description: 'Refonte complète du site web corporate',
    clientId: 1,
    clientName: 'Entreprise ABC',
    startDate: '2023-01-15',
    endDate: '2023-04-30',
    status: 'terminé'
  },
  {
    id: 2,
    name: 'Développement application mobile',
    description: 'Création d\'une application mobile pour les clients',
    clientId: 2,
    clientName: 'Société XYZ',
    startDate: '2023-03-01',
    status: 'en cours'
  },
  {
    id: 3,
    name: 'Migration infrastructure cloud',
    description: 'Migration des serveurs vers une infrastructure cloud',
    clientId: 3,
    clientName: 'Groupe 123',
    startDate: '2023-02-10',
    endDate: '2023-05-15',
    status: 'en cours'
  }
];

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('projects').select('*').order('startDate', { ascending: false });
    // if (error) throw error;
    // return data || [];
    
    // Pour l'instant, retourner les données fictives
    return Promise.resolve(mockProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const addProject = async (project: Partial<Project>): Promise<Project> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('projects').insert([project]).select().single();
    // if (error) throw error;
    // return data;
    
    // Pour l'instant, simuler l'ajout aux données fictives
    const newProject: Project = {
      id: mockProjects.length + 1,
      name: project.name || 'Nouveau projet',
      description: project.description || '',
      clientId: project.clientId || 1,
      clientName: project.clientName || 'Client inconnu',
      startDate: project.startDate || new Date().toISOString().split('T')[0],
      endDate: project.endDate,
      status: project.status || 'en cours'
    };
    mockProjects.push(newProject);
    return Promise.resolve(newProject);
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const updateProject = async (id: number, project: Partial<Project>): Promise<Project> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('projects').update(project).eq('id', id).select().single();
    // if (error) throw error;
    // return data;
    
    // Pour l'instant, simuler la mise à jour des données fictives
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Project with id ${id} not found`);
    
    mockProjects[index] = { ...mockProjects[index], ...project };
    return Promise.resolve(mockProjects[index]);
  } catch (error) {
    console.error(`Error updating project with id ${id}:`, error);
    throw error;
  }
};

export const getProjectById = async (id: number): Promise<Project> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    // if (error) throw error;
    // return data;
    
    // Pour l'instant, rechercher dans les données fictives
    const project = mockProjects.find(p => p.id === id);
    if (!project) throw new Error(`Project with id ${id} not found`);
    
    return Promise.resolve(project);
  } catch (error) {
    console.error(`Error fetching project with id ${id}:`, error);
    throw error;
  }
};

export const deleteProject = async (id: number): Promise<void> => {
  try {
    // Décommentez quand Supabase sera configuré
    // const { error } = await supabase.from('projects').delete().eq('id', id);
    // if (error) throw error;
    
    // Pour l'instant, simuler la suppression des données fictives
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Project with id ${id} not found`);
    
    mockProjects.splice(index, 1);
    return Promise.resolve();
  } catch (error) {
    console.error(`Error deleting project with id ${id}:`, error);
    throw error;
  }
};