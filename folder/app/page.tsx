export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            MenuMaster AI
          </h1>
          <p className="text-xl text-gray-700 mb-4">
            Restoranlar için Yapay Zeka Destekli
          </p>
          <p className="text-2xl font-semibold text-indigo-600 mb-8">
            Menü Yönetimi & Fiyat Optimizasyonu
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2">QR Menü</h3>
              <p className="text-gray-600">
                Anında güncellenebilen dijital menüler. Basılı menüye son!
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Fiyat Optimizasyonu</h3>
              <p className="text-gray-600">
                AI destekli fiyatlandırma. Rakipleri izleyin, karınızı artırın.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Maliyet Analizi</h3>
              <p className="text-gray-600">
                Malzeme bazlı maliyet hesaplama. Kar marjınızı görün.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Fiyatlandırma</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <p className="text-4xl font-bold text-indigo-600 mb-4">
                  500₺<span className="text-lg text-gray-600">/ay</span>
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-700">
                  <li>✅ 1 Lokasyon</li>
                  <li>✅ 50 Ürün</li>
                  <li>✅ QR Menü</li>
                  <li>✅ Temel Maliyet Hesaplama</li>
                  <li>✅ Email Destek</li>
                </ul>
              </div>

              <div className="bg-indigo-600 text-white rounded-lg shadow-2xl p-8 border-4 border-indigo-700 transform scale-105">
                <div className="bg-yellow-400 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                  POPÜLER
                </div>
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <p className="text-4xl font-bold mb-4">
                  1500₺<span className="text-lg opacity-80">/ay</span>
                </p>
                <ul className="text-left space-y-2 text-sm">
                  <li>✅ 3 Lokasyon</li>
                  <li>✅ 200 Ürün</li>
                  <li>✅ QR Menü + Çok Dil</li>
                  <li>✅ AI Fiyat Optimizasyonu</li>
                  <li>✅ Rakip Takibi</li>
                  <li>✅ Garson Asistanı App</li>
                  <li>✅ Öncelikli Destek</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-4xl font-bold text-indigo-600 mb-4">
                  2500₺<span className="text-lg text-gray-600">/ay</span>
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-700">
                  <li>✅ Sınırsız Lokasyon</li>
                  <li>✅ Sınırsız Ürün</li>
                  <li>✅ Beyaz Etiket</li>
                  <li>✅ API Erişimi</li>
                  <li>✅ Özel AI Modeli</li>
                  <li>✅ Dedike Hesap Yöneticisi</li>
                  <li>✅ 7/24 Destek</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-indigo-700 transition">
              14 Gün Ücretsiz Dene
            </button>
            <p className="text-gray-600 mt-4">Kredi kartı gerekmez</p>
          </div>
        </div>
      </div>
    </div>
  );
}
