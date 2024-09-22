type RequestOptions = {
  method?: string
  headers?: HeadersInit
  body?: any
  params?: Record<string, string>
  cache?: RequestCache
}

async function fetchWithDefaults(
  url: string,
  options: RequestOptions = {}
): Promise<any> {
  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  if (options.params) {
    const queryString = new URLSearchParams(options.params).toString()
    url += `?${queryString}`
  }

  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : null,
    cache: options.cache || "no-cache",
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Fetch error: ${error.message}`)
    }
    throw error
  }
}
export default fetchWithDefaults
