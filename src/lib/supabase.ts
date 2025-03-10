import { createClient } from '@supabase/supabase-js';

// Utilisation des clés d'API fournies
const supabaseUrl = 'https://sebgbxvcrsobjblbiuxz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlYmdieHZjcnNvYmpibGJpdXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMDI4MjksImV4cCI6MjA1NjU3ODgyOX0.rVfHsbXniM8FtQZ5J64INHlBGbol_AZ_wGgA7PR7ND8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);