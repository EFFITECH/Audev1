import { supabase } from '../lib/supabase';
import { Project } from '../types';

export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('startDate', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const addProject = async (project: Partial<Project>): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();

  if (error) {
    console.error('Error adding project:', error);
    throw new Error(error.message);
  }

  return data;
};

export const updateProject = async (id: number, project: Partial<Project>): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw new Error(error.message);
  }

  return data;
};

export const deleteProject = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw new Error(error.message);
  }
};