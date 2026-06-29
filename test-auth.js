import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://syvsngxmiidvogaxpfpl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5dnNuZ3htaWlkdm9nYXhwZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NjY2MzcsImV4cCI6MjA4ODA0MjYzN30.uwWA5Eca5pg6UXBW7VWq1BgC8b__H8_Ncz_uK2OkAGk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'pedro@team-nexio.com',
    password: 'Pluravita_8'
  });
  
  if (error) {
    console.error('Login failed:', error.message);
  } else {
    console.log('Login successful!', data.user?.email);
  }
}

testLogin();
