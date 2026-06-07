import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ozuwuczvhcdewwsskncz.supabase.co';
const supabaseAnonKey = 'sb_publishable_5FmHYaHbYFNgBSdPnw3Mew_ojAx6vTf';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
