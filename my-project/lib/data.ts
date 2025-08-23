// Fetch video data from the remote API endpoint
export async function fetchVideoData(skip = 0, limit = 100) {
  const url = `/api/videos?skip=${skip}&limit=${limit}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch video data")
  }
  return response.json()
}

// Usage Example (in your components or server):
// const data
//  = await fetchVideoData();
