import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('ℹ️ Para ejecutar la siembra automatizada remota, configura NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en tu archivo .env');
  console.log('ℹ️ También puedes pegar el contenido de supabase/seed.sql directamente en el SQL Editor de tu Dashboard de Supabase.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSeed() {
  console.log('🌱 Iniciando siembra de base de datos Anamnesis...');
  const seedSQL = fs.readFileSync(path.join(__dirname, '../supabase/seed.sql'), 'utf8');
  console.log('Ejecuta la migración y el seed mediante Supabase CLI o SQL Editor.');
}

runSeed();
