import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generatePricingSuggestion(params: {
  itemName: string
  currentPrice: number
  cost: number
  competitorPrices: number[]
  salesTrend?: 'up' | 'down' | 'stable'
  viewCount?: number
}) {
  const { itemName, currentPrice, cost, competitorPrices, salesTrend, viewCount } = params

  const competitorAvg = competitorPrices.length > 0
    ? competitorPrices.reduce((sum, p) => sum + p, 0) / competitorPrices.length
    : null

  const currentMargin = ((currentPrice - cost) / currentPrice) * 100

  const prompt = `Sen bir restoran danışmanısın. Aşağıdaki ürün için fiyat önerisi yap:

Ürün: ${itemName}
Mevcut Fiyat: ${currentPrice}₺
Maliyet: ${cost}₺
Mevcut Kar Marjı: %${currentMargin.toFixed(1)}
${competitorAvg ? `Rakip Ortalaması: ${competitorAvg.toFixed(2)}₺` : 'Rakip verisi yok'}
${competitorPrices.length > 0 ? `Rakip Fiyatları: ${competitorPrices.join('₺, ')}₺` : ''}
${salesTrend ? `Satış Trendi: ${salesTrend === 'up' ? 'Yükseliş' : salesTrend === 'down' ? 'Düşüş' : 'Stabil'}` : ''}
${viewCount ? `Menü Görüntüleme: ${viewCount}` : ''}

Şu formatta JSON yanıtı ver:
{
  "suggestedPrice": number (önerilen fiyat),
  "reasoning": string (kısa açıklama, 2-3 cümle),
  "confidence": number (0-1 arası güven skoru),
  "expectedImpact": string ("Kar artışı: +X₺" veya "Satış artışı bekleniyor" gibi)
}

Önerini yaparken:
- Kar marjı %50'nin altındaysa uyar
- Rakiplerden çok pahalıysa fiyat düşürmeyi öner
- Çok ucuzsa fiyat artırımı öner
- Maliyeti her zaman karşılayacak fiyat öner`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Sen profesyonel bir restoran danışmanısın. Fiyatlandırma konusunda uzmansın. Her zaman JSON formatında yanıt verirsin.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw error
  }
}

export async function generateMenuOptimization(params: {
  categories: Array<{
    name: string
    items: Array<{
      name: string
      price: number
      profitMargin: number
      viewCount: number
    }>
  }>
}) {
  const prompt = `Sen bir restoran danışmanısın. Aşağıdaki menü datasına bakarak optimizasyon önerileri yap:

${JSON.stringify(params.categories, null, 2)}

Şu formatta JSON yanıtı ver:
{
  "suggestions": [
    {
      "type": "PRICE_CHANGE" | "MENU_PLACEMENT" | "CROSS_SELL" | "REMOVE_ITEM" | "ADD_ITEM",
      "title": string (kısa başlık),
      "description": string (detaylı açıklama),
      "confidence": number (0-1),
      "estimatedImpact": string (tahmini gelir etkisi)
    }
  ]
}

Şunlara dikkat et:
- Düşük kar marjlı ürünleri belirt
- Popüler ama düşük marjlı ürünler varsa fiyat artışı öner
- Hiç görüntülenmeyen ürünleri kaldırmayı öner
- Cross-sell fırsatlarını bul`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Sen profesyonel bir restoran danışmanısın. Menü optimizasyonu konusunda uzmansın.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw error
  }
}
