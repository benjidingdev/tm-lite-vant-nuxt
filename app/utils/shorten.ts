/**
 * Universal URL Shortener Utility
 * Support TinyURL / is.gd，auto fallback
 * @param url default URL
 * @returns short URL
 */
export async function shortenURL(url: string): Promise<string> {
  // TinyURL
  try {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`)
    if (res.ok) {
      const shortUrl = await res.text()
      if (shortUrl.startsWith("http")) return shortUrl
    }
  } catch (err) {
    console.warn("TinyURL failure,", err)
  }

  // is.gd
  try {
    const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`)
    if (res.ok) {
      const shortUrl = await res.text()
      if (shortUrl.startsWith("http")) return shortUrl
    }
  } catch (err) {
    console.warn("is.gd failure,", err)
  }

  // fallback
  return url
}
