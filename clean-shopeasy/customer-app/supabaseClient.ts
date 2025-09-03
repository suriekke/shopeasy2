// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://fxrvemzqhoyfbsksrxzo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cnZlbXpxaG95ZmJza3NyeHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTU3NDksImV4cCI6MjA3MjAzMTc0OX0.dVjXTsmLvmSWVzza7EQy06oKTfrGTzR9STFpjLN8ghQ'
);
