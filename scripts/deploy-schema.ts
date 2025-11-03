import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = 'https://udbaskgnnajcxbgcxmvj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkYmFza2dubmFqY3hiZ2N4bXZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjEyOTg1NiwiZXhwIjoyMDc3NzA1ODU2fQ.8h5LC8FWixgCZrKfU79QMfth5xUO5XS4HUADnC0gsmc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function deploySchema() {
  try {
    console.log('🚀 Deploying database schema to Supabase...\n');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251102000000_init_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Read migration file (length: ' + sql.length + ' characters)\n');
    console.log('⚙️  Executing SQL migration...\n');

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();

    if (error) {
      // The exec_sql function might not exist, so let's try a direct approach
      console.log('ℹ️  exec_sql function not available, trying direct execution...\n');

      // Split into individual statements and execute them
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ';';

        // Skip comments
        if (statement.trim().startsWith('--')) continue;

        try {
          const { error: stmtError } = await supabase.rpc('exec', { sql: statement });
          if (stmtError) {
            console.log(`❌ Error in statement ${i + 1}: ${stmtError.message}`);
            errorCount++;
          } else {
            successCount++;
            if (successCount % 10 === 0) {
              console.log(`✅ Executed ${successCount} statements...`);
            }
          }
        } catch (e: any) {
          console.log(`❌ Error in statement ${i + 1}: ${e.message}`);
          errorCount++;
        }
      }

      console.log(`\n📊 Execution complete:`);
      console.log(`  ✅ Successful: ${successCount}`);
      console.log(`  ❌ Failed: ${errorCount}`);
    } else {
      console.log('✅ Schema deployed successfully!');
    }

    console.log('\n🔗 View your database: https://supabase.com/dashboard/project/udbaskgnnajcxbgcxmvj/editor');
  } catch (error: any) {
    console.error('❌ Deployment error:', error.message);
    console.log('\n💡 Alternative: Copy the SQL from supabase/migrations/20251102000000_init_schema.sql');
    console.log('   and paste it into the Supabase SQL Editor at:');
    console.log('   https://supabase.com/dashboard/project/udbaskgnnajcxbgcxmvj/sql/new');
  }
}

deploySchema();
