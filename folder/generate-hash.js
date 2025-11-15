// Şifre hash'i oluştur
const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Admin123!';
  const hash = await bcrypt.hash(password, 10);
  console.log('\n🔐 Şifre Hash Oluşturuldu:');
  console.log('Şifre:', password);
  console.log('Hash:', hash);
  console.log('\nseed-data.sql dosyasında bu hash\'i kullan:\n');
  console.log(`'${hash}'`);
}

generateHash().catch(console.error);
