import Head from 'next/head'
import { useEffect, useState } from 'react'

type Coin = {
  id: string
  symbol: string
  name: string
  current_price: number
  image: string
  price_change_percentage_24h: number
}

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const TOP_N = 20
  const REFRESH_MS = 30000 // 30s

  useEffect(() => {
    let mounted = true
    async function fetchCoins() {
      setLoading(true)
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${TOP_N}&page=1&sparkline=false`
        )
        const data = await res.json()
        if (mounted) setCoins(data)
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchCoins()
    const iv = setInterval(fetchCoins, REFRESH_MS)
    return () => {
      mounted = false
      clearInterval(iv)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Crypto Price Tracker</title>
      </Head>
      <main className="min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">Crypto Price Tracker (Top {TOP_N})</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-4">
            {coins.map((c) => (
              <li key={c.id} className="p-4 bg-white rounded shadow flex items-center">
                <img src={c.image} alt={c.name} className="w-10 h-10 mr-4" />
                <div className="flex-1">
                  <div className="font-medium">{c.name} ({c.symbol.toUpperCase()})</div>
                  <div className="text-sm text-gray-600">${c.current_price.toLocaleString()}</div>
                </div>
                <div className={c.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {c.price_change_percentage_24h?.toFixed(2)}%
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
