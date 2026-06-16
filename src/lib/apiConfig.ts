const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl) {
  throw new Error('Missing API environment config: VITE_API_BASE_URL')
}

const normalizedApiBaseUrl = apiBaseUrl.replace(/\/+$/, '')

export const apiEndpoints = {
  insights: `${normalizedApiBaseUrl}/insights`,
  transactions: `${normalizedApiBaseUrl}/transactions`,
  receiptUpload: `${normalizedApiBaseUrl}/receipts/upload`,
} as const
