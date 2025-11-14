const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read DATABASE_URL from .env.local
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  const client = await pool.connect();

  try {
    console.log('Connected to database successfully!');

    // Read and execute SQL file
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');

    console.log('Executing schema creation...');
    await client.query(sql);

    console.log('✅ Database schema created successfully!');
    console.log('\nTables created:');
    console.log('- users');
    console.log('- restaurants');
    console.log('- locations');
    console.log('- categories');
    console.log('- menu_items');
    console.log('- menu_variants');
    console.log('- ingredients');
    console.log('- recipes');
    console.log('- price_history');
    console.log('- qr_codes');
    console.log('- menu_views');
    console.log('- competitor_prices');
    console.log('- ai_suggestions');

  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase()
  .then(() => {
    console.log('\n✅ Setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  });
