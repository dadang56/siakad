import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ozuwuczvhcdewwsskncz.supabase.co';
const supabaseAnonKey = 'sb_publishable_5FmHYaHbYFNgBSdPnw3Mew_ojAx6vTf';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("=== Fetching all settings from app_settings table ===");
  const { data, error } = await supabase
    .from('app_settings')
    .select('*');

  if (error) {
    console.error("Load Error:", error);
    return;
  }
  
  console.log("Settings data:", JSON.stringify(data, null, 2));
}

run();
