interface Currency {
  code: string
  symbol: string
  rate: number
}

export const currencies: Record<string, Currency> = {
  USD: { code: "USD", symbol: "$", rate: 1 },
  EUR: { code: "EUR", symbol: "€", rate: 0.85 },
  GBP: { code: "GBP", symbol: "£", rate: 0.73 },
  CAD: { code: "CAD", symbol: "C$", rate: 1.25 },
  AUD: { code: "AUD", symbol: "A$", rate: 1.35 },
}

export const countryCurrencyMap: Record<string, string> = {
  US: "USD",
  CA: "CAD",
  GB: "GBP",
  AU: "AUD",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
}

export function formatPrice(price: number, currency: Currency): string {
  const convertedPrice = price * currency.rate
  return `${currency.symbol}${convertedPrice.toFixed(2)}`
}

export async function detectCountry(): Promise<string> {
  try {
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()
    return data.country_code || "US"
  } catch (error) {
    console.error("Failed to detect country:", error)
    return "US"
  }
}
