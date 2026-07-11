const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const SUPABASE_URL = urlMatch ? urlMatch[1].trim() : '';
const SUPABASE_KEY = keyMatch ? keyMatch[1].trim() : '';

async function test() {
  const req = async (table) => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    const data = await res.json();
    console.log(`${table}:`, data);
  };
  await req('kualitas_keluarga');
  await req('kualitas_art');
  await req('anomali_keluarga');
}
test();
